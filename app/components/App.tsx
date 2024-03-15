"use client"

import React, { JSXElementConstructor, ReactNode, useCallback, useEffect, useState } from 'react'
import prisma from '../lib/prismaClient';
import { User } from '../types/types';
import { Timecard } from '../types/types';
import getCurrentUser from '../actions/getCurrentUser';
import axios from 'axios';
import { object } from 'zod';
import moment, { utc } from 'moment';
import momentTimezone from 'moment-timezone';
import StopWatch from './stopwatch/StopWatch';
// import { error } from 'console';


export type AppProps = {
    currentUser: User | null,
    // id:string | null 
    // name:string | null
    // email:string | null
    // createdAt:Date | null
    // updatedAt:Date | null
    // hashedPassword:string | null
    // children: React.ReactNode
}

const App:React.FC<AppProps> =  ({currentUser}) => {

    const [users, setUsers] = useState([]);
    const [timecards, setTimecards] = useState([])
    const [workingState, setWorkingState] = useState(false)
    const [userId, setUserId] = useState("");
    const [savedStartedTime, setSavedStatedTime] = useState("")
    const [savedEndedTime, setSavedEndedTime] = useState("")
    const [saveStartTime,setSaveStartTime]= useState("")
    const [saveEndTime,setSaveEndTime] = useState("")
    const [startedData, setStartedData] = useState("")
    const [measuredTime, setMeasuredTime] = useState("")
    const [lists, setLists] = useState<Timecard[]>([])
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
                const convertedStartTime = moment(data.startedTime.startedAt)
                // setSaveStartTime(convertedStartTime)
                // console.log(convertedStartTime)
                setSaveStartTime(data.startedTime.startedAt)
                // const startTime = convertedTime.add(9,"hours")
                console.log(convertedStartTime.format('YYYY/MM/DD HH:mm:ss'));
                setSavedStatedTime(convertedStartTime.format('YYYY/MM/DD HH:mm:ss'))
    
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
            // console.log(userId)
            // console.log(startedData);
            // console.log(savedStartedTime);
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
            // console.log(data)
            // console.log(data.endedTime.endedAt)
            const convertedEndTime = moment(data.endedTime.endedAt)
            setSaveEndTime(data.endedTime.endedAt);
            console.log(convertedEndTime.format('YYYY/MM/DD HH:mm:ss'));
            setSavedEndedTime(convertedEndTime.format('YYYY/MM/DD HH:mm:ss'))

            //始まりと終わりの差を計測する
            
            const statedAt = moment(saveStartTime)
            
    
            const diff2 = convertedEndTime.diff(statedAt,'milliseconds')
            console.log(diff2)
            // console.log(moment(diff2).add(-9,'hours').format('hh:mm:ss'))
            // const diffedTime = moment.tz(diff2,'Asia/Tokyo').format('hh:mm:ss')
            // console.log(moment.tz(diff, 'Asia/Tokyo').format('hh:mm:ss'))
            // dif2 = moment.tz()
            // console.log(diffedTime)
            const date= new Date(diff2)
            const hours = date.getUTCHours()
            const minutes = date.getUTCMinutes()
            const seconds = date.getSeconds()

            const formattedTime = `${hours}:${minutes}:${seconds}`
            console.log(formattedTime);
            setMeasuredTime(formattedTime)
            
        } else {
            
            alert("開始ボタンが押されていません")
        }
        
        //ここらからは別
        // if(currentUser){
        
    }

    
    
    // if(!statedAt || !endedAt){
        
    //     console.log('計測中')
        
    // } else {
        
    // }

    const handleList = async () => {
        const response = await fetch('http://localhost:3000/api/timecard/list',{
            cache:"no-store"
        })
        const listData = await response.json()
        console.log(listData)
        setLists(listData)
        // return lists

    }
    

  return (
    <div className=' flex flex-col'>
        <h1 className=' text-4xl bg-green-400 text-slate-50 rounded-md font-bold px-[50px] py-[5px] text-center'>
            タイムカード
        </h1>
        <div className=' flex flex-col mt-[60px] gap-5'>
            <div className=' bg-sky-400 w-[1000px] h-[80px] flex gap-20 justify-center  '>
                <div className='  border-2 border-slate-50 rounded-lg bg-gray-300 my-1 px-5 pt-6 text-center hover:scale-105 active:scale-95 cursor-pointer' onClick={timecardStart} >開始</div>
                <div className='  border-2 border-slate-50 rounded-lg my-1 px-5 pt-6 bg-red-500 hover:scale-105 active:scale-95 cursor-pointer' onClick={timeCardEnd} >停止</div>

                { workingState ? (

                    <div className=' border-2 border-black  my-1 rounded-lg px-5 pt-6 text-red-500 font-bold'  >仕事中</div>
                ):
                (
                    <div className=' border-2 border-black  my-1 rounded-lg px-5 pt-6 text-blue-600 font-bold'  >準備中</div>
                    
                )}
                <div className='  border-2 border-slate-50 rounded-lg my-1 px-5 pt-3 text-wrap '>
                    <div>経過時間</div>
                    <div className=' text-center'>{measuredTime}</div>
                </div>
                <div className=' border-2 border-black text-slate-50 my-1 rounded-lg px-5 pt-3'  >
                    <div>合計時間</div>
                    <div className=' text-center'>{measuredTime}</div>
                    
                </div>


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
                <div className=' border-2 border-blue-600 w-[1000px] h-auto p-5'>

                    <div>その日の合計時間を表示させるために一覧表示させてみる</div>
                    <div className=' w-[200px] h-[50px] bg-orange-400 border-gray-400 border-2 mt-5 text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' onClick={handleList}>ボタン</div>
                    <ul className=' mt-10' >
                        {lists.map((list) => (
                            <div>
                                <li key={list.id} className='mt-5'>
                                     開始時間:{list.startedAt}
                                </li>
                                <li  className=''>
                                    停止時間{list.endedAt}
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>
        </div>

        <StopWatch currentUser = {currentUser}  />
        
    </div>
  )
}

export default App