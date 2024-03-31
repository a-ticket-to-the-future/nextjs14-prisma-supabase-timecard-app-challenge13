import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prismaClient"
import moment from "moment"

export async function GET(req: NextRequest, res: NextResponse){

    try{

        const currentUser = await getCurrentUser()

        // if (currentUser) {

            const timecardData = await prisma.timecard.findMany({
                where:{ 
                    startedAt: {
                        // gte: new Date('2024-03-17 00:00:00'),
                        // lte: new Date('2024-03-17 23:59:59'),
                        // gte: new Date(),
                        // lte: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),23,59,59),
                           gte: moment().startOf("day").toDate(),
                           lte: moment().endOf("day").toDate(),
                    },
                 },
                // include: {user:true}
            })
            // console.log(timecardData)
            return NextResponse.json(timecardData)
        // }

    } catch (error) {
        console.log(error)
        return new NextResponse('Error', { status: 500})
    }
}