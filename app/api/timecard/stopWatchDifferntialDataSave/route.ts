import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient"


export async function POST(req:NextRequest,res:NextResponse) {
    try {
        const {measuredTime2,savedStopWatchStartedId} = await req.json()
        console.log(measuredTime2,savedStopWatchStartedId)

        const stopWatchMeasuredValue = await prisma.stopwatch.update({
            where:{
                id:savedStopWatchStartedId,
            },
            data:{
                stopWatchSubTotal:measuredTime2,

            },
        })
        console.log(stopWatchMeasuredValue)
        return NextResponse.json({stopWatchMeasuredValue})

    } catch (error) {
        return new NextResponse('Errorだよ',{status:500})
    }
}