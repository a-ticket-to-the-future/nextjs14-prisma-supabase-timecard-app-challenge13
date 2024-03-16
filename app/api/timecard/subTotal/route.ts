import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient"

export async function PUT (req:NextRequest, res:NextResponse) {
    
    try {

        const {userId,formattedTime} = await req.json()
        
        console.log(userId,formattedTime)

        const subTotal = await prisma.timecard.update({
            where : {
                id : userId,
            },
            data : {
                subTotal : formattedTime
            },
        })
        console.log(subTotal)
        return NextResponse.json({subTotal})

    } catch (error) {
        console.log(error)
        return new NextResponse('エラーです',{status:500})
    }

}