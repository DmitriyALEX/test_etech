import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/helpers/prismadb'

export async function POST(req: NextRequest) {
    try {
        const { questionnaireId, seconds, minute, answer } = await req.json()

        await prisma.completedAnswers.create({
            data: {
                questionnaireId: questionnaireId,
                completedMinutes: minute,
                completedSeconds: seconds,
                completedAnswer: answer,
            },
        })

        return NextResponse.json({ data: 'completedQuestionnaires' })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
