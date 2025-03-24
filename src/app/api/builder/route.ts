import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/helpers/prismadb'
import { IQuestion } from '../../../types/questionnaire.interface'

export async function POST(req: NextRequest) {
    try {
        const { questionnaire } = await req.json()

        const encodedQuestionnaire = JSON.stringify(questionnaire, null, 2)
        const decodedQuestionnaire = JSON.parse(encodedQuestionnaire)

        const createdQuestionnaires = []

        for (const q of decodedQuestionnaire) {
            const createQuestionnaire = await prisma.questionnaire.create({
                data: {
                    title: q.title,
                    description: q.description,
                },
            })

            const createdQuestions = await Promise.all(
                q.questions.map(async (question: IQuestion) => {
                    return prisma.questions.create({
                        data: {
                            questionnaireId: createQuestionnaire.id,
                            questionTitle: question.questionTitle,
                            questionType: question.questionType,
                            answer: question.questionAnswers,
                        },
                    })
                }),
            )
            createdQuestionnaires.push({ questionnaire: createQuestionnaire, questions: createdQuestions })
        }
        return NextResponse.json({ data: createdQuestionnaires }, { status: 201 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
