"use client"

import React, { useCallback, useEffect, useState } from 'react'
import prisma from '../lib/prismaClient';
import { User } from '../types/types';
import { Timecard } from '../types/types';
import getCurrentUser from '../actions/getCurrentUser';
import axios from 'axios';
import { object } from 'zod';
import moment from 'moment';
// import { error } from 'console';




const App =  (currentUser:User) => {

    const [users, setUsers] = useState([]);
    const [timecards, setTimecards] = useState([])
    const [workingState, setWorkingState] = useState(false)
    const [userId, setUserId] = useState("");
    const [savedStartedTime, setSavedStatedTime] = useState("")
    const [startedData, setStartedData] = useState("")
    // const { supabase } = useSpabase();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("http://localhost:3000/api/users",{
                cache:'no-store',
            }) 
            
            const usersData:User = await response.json();

        
            // console.log(usersData)
            return usersData
        }
        fetchUsers()
    },[])

    useEffect( () => {
        const fetchTimecards = async () => {
            const response =  fetch("http://localhost:3000/api/timecard",{
                cache:'no-store',
            }) 
            
            const timecardData:Timecard = await (await response).json();
            return timecardData;
        }
        fetchTimecards()
    },[])

    const timecardStart = async() => {
        if(!workingState){

            setWorkingState(true)
    
            // const currentUser = await getCurrentUser()
            if(currentUser){
    
                const userId =  currentUser.id
                const res = await fetch('http://localhost:3000/api/timecard/start',{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({userId})
                })
                // console.log(res.json());
                const data = await res.json()
                // console.log(data)
                setStartedData(data)
                console.log(data.startedTime.id)
                setUserId(data.startedTime.id);
                // console.log(data.startedTime.startedAt)
                // setSavedStatedTime(data.startedTime.startedAt) 
                // console.log(savedStartedTime);
                const convertedTime = moment(data.startedTime.startedAt)
                // const startTime = convertedTime.add(9,"hours")
                console.log(convertedTime.format('YYYY/MM/DD HH:mm:ss'));
                setSavedStatedTime(convertedTime.format('YYYY/MM/DD HH:mm:ss'))
    
            } else {
                console.error('エラーです')
            }
        } else {
            alert('すでに開始ボタンが押されています')
        }
        
    }

    const timeCardEnd = async () => {
        
        // useCallback(() => {
        //     setWorkingState(false)

        // },[workingState])

        if (workingState) {

            setWorkingState(false)
            console.log(userId)
            console.log(startedData);
            console.log(savedStartedTime);
            // console.log(startedData)

            // const userId = currentUser.id
            const res = await fetch('http://localhost:3000/api/timecard/end',{
                method:"PUT",
                headers: {
                    "Content-Type": "application/json",   
                },
                body:JSON.stringify({userId,savedStartedTime})
            });
            // console.log(res.body)
            const data = await res.json();
            console.log(data)
        

        } else {
            
            alert("開始ボタンが押されていません")
        }

        //ここらからは別
        // if(currentUser){
        
    }

  return (
    <div className=' flex flex-col'>
        <h1 className=' text-4xl bg-green-400 text-slate-50 rounded-md font-bold px-[50px] py-[5px] text-center'>
            タイムカード
        </h1>
        <div className=' flex flex-col mt-[60px] gap-5'>
            <div className=' bg-sky-400 w-[800px] h-[60px] flex gap-20 justify-center '>
                <div className='  border-2 border-slate-50 rounded-lg bg-gray-300 my-1 px-5 pt-3 text-center hover:scale-105 active:scale-95 cursor-pointer' onClick={timecardStart} >開始</div>
                <div className='  border-2 border-slate-50 rounded-lg my-1 px-5 pt-3 bg-red-500 hover:scale-105 active:scale-95 cursor-pointer' onClick={timeCardEnd} >停止</div>

                { workingState ? (

                    <div className=' border-2 border-black  my-1 rounded-lg px-5 pt-3 text-red-500 font-bold'  >仕事中</div>
                ):
                (
                    <div className=' border-2 border-black  my-1 rounded-lg px-5 pt-3 text-blue-600 font-bold'  >準備中</div>
                    
                )}
                <div className='  border-2 border-slate-50 rounded-lg my-1 px-5 pt-3 '>経過時間</div>
                <div className=' border-2 border-black text-slate-50 my-1 rounded-lg px-5 pt-3'  >合計時間</div>


            </div>
            {/* <div className=' bg-sky-400 w-[800px] h-[50px] flex gap-20 justify-center '>
                <div className='  border-2 border-slate-50 rounded-lg px-5 pt-3'>ボタン</div>
                <div className=' border-2 border-black text-slate-50 rounded-lg px-5 pt-3'  >状態</div>
                <div className='  border-2 border-slate-50 rounded-lg px-5 pt-3'>計測値</div>
                <div className=' border-2 border-black text-slate-50 rounded-lg px-5 pt-3'  >合計時間</div>


            </div>
            <div className=' bg-sky-400 w-[800px] h-[50px] flex gap-20 justify-center '>
                <div className='  border-2 border-slate-50 rounded-lg px-5 pt-3'>ボタン</div>
                <div className=' border-2 border-black text-slate-50 rounded-lg px-5 pt-3'  >状態</div>
                <div className='  border-2 border-slate-50 rounded-lg px-5 pt-3'>計測値</div>
                <div className=' border-2 border-black text-slate-50 rounded-lg px-5 pt-3'  >合計時間</div>


            </div> */}
        </div>
    </div>
  )
}

export default App