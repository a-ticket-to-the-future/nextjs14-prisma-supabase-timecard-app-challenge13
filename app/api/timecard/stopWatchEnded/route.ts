import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient"


export async function POST(req:NextRequest, res:NextResponse) {
    try {
        const {userId} = await req.json()
        console.log(userId)

        const stopWatchEnded = await prisma.stopwatch.create({
            data: {
                userId:userId,
                endedAt : new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })
        console.log(stopWatchEnded)
        return NextResponse.json({stopWatchEnded})


    } catch (error) {
        return new NextResponse('Error',{status:500})
    }
}