import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import  prisma  from '@/app/lib/prismaClient'


export async function PUT(req: NextRequest, res:NextResponse) {

    try{

        const {startedData} = await req.json();
        // console.log({startedTime,startedData})
        // const userId = startedData.startedAt.id
        console.log(startedData.checkUserId.id)
    //     const currentUser = await getCurrentUser()
    //     const userId = currentUser?.id
        const userId = startedData.checkUserId
    //     ここから下は動いた
        const endedTime = await prisma.timecard.update({
            where:{
                id:userId.id
            },
            data: {
                // userId:userId,
                endedAt: new Date(),
                
            },
        });
        console.log(endedTime);
        return  NextResponse.json({endedTime})

       } catch (error) {
        console.log(error);
        return new NextResponse('Error',{status:500})
       }
    

    //ここからは別

    // try {

    //     const currentUser = await getCurrentUser()

    //     if (currentUser) {
    //         const endedTime = await prisma.timecard.update({
    //             where: {id:currentUser.id},
    //             data: {
    //                 endedAt: new Date()
    //             }
    //         })

    //         return NextResponse.json(endedTime)
    //     }

    // } catch (error) {
    //     console.log(error)
    //     return new NextResponse('Error', {status: 500})
    // }
    
}