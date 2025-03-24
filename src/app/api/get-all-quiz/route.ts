import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/helpers/prismadb'
export async function GET(req: NextRequest) {
    try {
        const getQuestionnaire = await prisma.questionnaire.findMany()
        const getQuestions = await prisma.questions.findMany()
        return NextResponse.json({ questionnaire: getQuestionnaire, questions: getQuestions })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
