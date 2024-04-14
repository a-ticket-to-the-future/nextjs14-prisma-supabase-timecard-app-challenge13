import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient"

export async function PUT(req:NextRequest, res:NextResponse){

    try {

        
        const endScanUserId = await req.json()
    // console.log(endScanUserId.codeData)
    console.log(endScanUserId.codeData)
    console.log(endScanUserId.startedData.checkUserId.id)

    const userId = endScanUserId.codeData
    const id2 = endScanUserId.startedData.checkUserId.id
 
    const endScanData = await prisma.timecard.update({
        where: {
            id:id2,
        },
        data:{
            endedAt: new Date(),
        },
    })
    return NextResponse.json({endScanData})

    } catch (error) {

        return new NextResponse('Errorです',{status:500})

    }

    
    


}