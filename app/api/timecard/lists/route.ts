import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prismaClient"

export async function GET(req: NextRequest, res: NextResponse){

    try{

        const currentUser = await getCurrentUser()

        // if (currentUser) {

            const timecardData = await prisma.timecard.findMany({
                where:{ 
                    startedAt: {
                        gte: new Date('2024-03-17 00:00:00'),
                        lte: new Date('2024-03-17 23:59:59'),
                    },
                 },
                // include: {user:true}
            })
            
            return NextResponse.json(timecardData)
        // }

    } catch (error) {
        console.log(error)
        return new NextResponse('Error', { status: 500})
    }
}