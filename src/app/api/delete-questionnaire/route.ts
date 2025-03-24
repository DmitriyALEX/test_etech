import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/helpers/prismadb'

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json()
        const questionnaireId = await prisma.questionnaire.findUnique({
            where: { id: id },
        })

        if (questionnaireId) {
            await prisma.questions.deleteMany({
                where: { questionnaireId: id },
            })
            await prisma.questionnaire.delete({
                where: { id: id },
            })
            return NextResponse.json({ status: 'success' })
        }

        return NextResponse.json({ status: 'false' })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
