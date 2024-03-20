import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient"
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(req:NextRequest, res:NextResponse) {

    try {

        const {userId,savedStopWatchStarted,savedStopWatchStartedId} = await req.json()
        //　ここをオブジェクトとして認識することをわすれないで！
        //{}なしで記述するとエラーになる
        console.log(userId,savedStopWatchStarted,savedStopWatchStartedId)

        // const currentUser = await getCurrentUser()
        // const userId = currentUser?.id
        // console.log(userId)
    
        const stopWatchStarted = await prisma.stopwatch.create({
            data: {
                id: savedStopWatchStartedId,
                userId:userId,
                startedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                

                
            },
        })

        return NextResponse.json({stopWatchStarted})
    } catch (error) {
        return new NextResponse('Error',{status:500})
    }
    


}