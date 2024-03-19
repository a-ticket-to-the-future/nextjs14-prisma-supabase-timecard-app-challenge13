import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";
import getCurrentUser from '@/app/actions/getCurrentUser';
import { date } from "zod";

export async function POST(req:NextRequest,res:NextResponse) {

    try {

        // const currentUser = await getCurrentUser();

        const {userId} = await req.json()
        // const userId = body
        console.log(userId);
        // const currentUser = await getCurrentUser();
        // const userId = currentUser?.id

        // if( {userId}) {
        const startedTime = await prisma.timecard.create({
            // where : {
            //     id: currentUser.id
            // },
            data: {
                userId:userId,
                startedAt: new Date(),
                endedAt:null,
            },
        });
    
        // console.log(startedTime)
        return NextResponse.json({startedTime});
    // }
    } catch (error) {
        console.log(error)
        return new NextResponse('Error',{status:500})
    }

}