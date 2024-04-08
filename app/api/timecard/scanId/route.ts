import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient"
import { Timecard } from "@/app/types/types";

export async function POST (req:NextRequest, res:NextResponse) {


    // try {
        

    // const userData = await prisma.timecard.findUnique({
    //     where:{
    //         userId:userId,
    //     },
    // })
    
    // console.log(userData);

    // if ( userId ) {
    try {

        const data = await req.json();
        console.log(data.userIdData);
        const userId = data.userIdData

    //         const checkUserId = await prisma.timecard.findUnique({
    //             where:{
    //                 userId,

    //             }
    //         })
    //     } catch (error) {
    //         return null
    //     }
    //     } else {
    //         return new NextResponse('Error',{status:500})
    //     }

    

        const checkUserId = await prisma.timecard.create({
        
            data:{
                userId:userId,
                startedAt: new Date(),
            },
        })
        console.log({checkUserId})
        return NextResponse.json({checkUserId})
    
    } catch (error) {
        return new NextResponse("Error",{status:500})
    }
    


}