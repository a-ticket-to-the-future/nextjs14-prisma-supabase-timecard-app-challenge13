import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient"


export async function PUT(req:NextRequest, res:NextResponse) {
    try {
        const {userId,savedStopWatchStarted,savedStopWatchStartedId} = await req.json()
        // console.log(userId,savedStopWatchStarted,savedStopWatchStartedId)

        const stopWatchEnded = await prisma.stopwatch.update({
            where : {
                id:savedStopWatchStartedId
            },
            data: {
                
                endedAt : new Date(),
                
            },
        })
        // console.log(stopWatchEnded)
        return NextResponse.json({stopWatchEnded})


    } catch (error) {
        return new NextResponse('Error',{status:500})
    }
}