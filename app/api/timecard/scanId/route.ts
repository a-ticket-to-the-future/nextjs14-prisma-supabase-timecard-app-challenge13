import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient"

export async function GET (req:NextRequest, res:NextResponse) {

    const userId = req.body;
    console.log(userId);

    // const checkUserId = await prisma.timecard.update({
    //     where:{
    //         startedAt: new Date(),
    //     }
    // })

}