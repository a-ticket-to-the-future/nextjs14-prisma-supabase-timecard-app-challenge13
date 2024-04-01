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
// import DiffedSubTotal from '../actions/diffedSubTotal/DiffedSubTotal';
import { list } from 'postcss';
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
    const [subTotal, setSubTotal] = useState("")
    const [total , setTotal] = useState("")
    const [convertedDate , setConvertedDate] = useState("")
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
            setMeasuredTime(formattedTime);

            const res2 = await fetch('http://localhost:3000/api/timecard/subTotal',{
                method:"PUT",
                headers: {
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({userId,formattedTime})

            })

            const data2 = await res2.json()
            // console.log(data2)

            const receivedSubTotal = data2.subTotal.subTotal
            console.log(receivedSubTotal);
            setSubTotal(receivedSubTotal);

            
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

    const handleList: () => Promise<void> = async () => {
        const response = await fetch('http://localhost:3000/api/timecard/lists',{
            cache:"no-store"
        })
        const listData = await response.json()
        console.log(listData)
        setLists(listData)


        //取得したsubTotalを足し合わせてtotalを表示させにいく。

        const today = new Date()
        const formattedDate = today.toDateString()
        console.log(formattedDate)
        const date2 = moment(formattedDate).format('YYYY/MM/DD')
        console.log(date2)
        setConvertedDate(date2) 

        const total = listData.reduce((acc:moment.Duration,timecard:Timecard) => {
            const convertedSubTotal = moment.duration(timecard.subTotal);
            return acc.add(convertedSubTotal);
        },moment.duration())
        
        console.log(total)
        // console.log(total._data)
        // console.log(total._data.seconds)
        // let formattedTotal;
        const totalData = total._data
        // console.log(totalData)
        // if(total){
        // console.log(moment(total).format('HH:mm:ss'))これでは00:00:00がしゅつりょくされた
            const hours2 = totalData.hours
            const minutes2 = totalData.minutes
            const seconds2 = totalData.seconds

            const formattedTotal = `${hours2}時間${minutes2}分${seconds2}秒`
            // const slicedData = listData.slice(0, listData.length);
            // console.log(slicedData)
            console.log(formattedTotal)
            setTotal(formattedTotal)
        // } else {
        //     console.log("totalがnullだよ")
        // }



        // const slicedData = [];
        // for (let i = 0; i < listData.length; i++) {
        //   slicedData.push(listData[i]);
        // }

        // console.log(slicedData);

        // return lists

        // const convertedEndTime = moment(data.endedTime.endedAt)
        // const convertedEndTime2 = moment(listData)
        // const subtitle = convertedEndTime.diff(statedAt,'milliseconds')
        

    }

    const handleSubTotalView = async () => {

        
        // const subTotal = await fetch ('http://localhost:3000/api/timecard/list',{
        //     cache:"no-store"
        // })


        //     const date = new Date()

            
        //     const hours =  date.getUTCHours()
        //     const minutes = date.getUTCMinutes()
        //     const seconds = date.getSeconds()

        //     const formattedTime = `${hours}:${minutes}:${seconds}`
        
        // const subTotal = "ここに計算式"
        
        // const subTotalResponse = await fetch('http://localhost:3000/api/timecard/subTotal',{
        //     method:"PUT",
        //     headers :{
        //         "Content-Type":"application/json",
        //     },
        //     body:JSON.stringify({subTotal})
        // })
        // const subTotalData = await subTotalResponse.json()
        // console.log(subTotalData)
        
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
                    <div>計測時間</div>
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
                            <div key={list.id}>
                                <li  className='mt-5'>
                                     {/* 開始時間:{list.startedAt} */}
                                     開始時間:{moment(list.startedAt).format('YYYY-MM-DD HH:mm:ss')}
                                </li>
                                <li  className=''>
                                    停止時間:{moment(list.endedAt).format('YYYY-MM-DD HH:mm:ss')}
                                </li>
                    
                                {/* <div className=' w-[200px] h-[50px] bg-orange-400 border-gray-400 border-2 mt-5 text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' onClick={handleSubTotalView}>小計を確認</div> */}

                                <li  className=''>
                                    {/* 小計:{moment(list.endedAt).diff(list.startedAt,"milliseconds") } */}
                                    小計:{list.subTotal }
                                    {/* {DiffedSubTotal(moment(list.endedAt).diff(list.startedAt,"milliseconds"))} */}
                                    {/* 小計:{moment(list.subTotal).format('YYYY-MM-DD HH:mm:ss')} */}
                                    {/* <div className=' w-[200px] h-[50px] bg-orange-400 border-gray-400 border-2 mt-5 text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' onClick={handleSubTotalView}>小計を確認</div> */}
                                </li>
                            </div>
                        ))
                        
                        }
                        {lists.length !== 0 ?  (
                            <div className=' text-2xl font-bold text-red-500 mt-5'>本日、{`${convertedDate}`}の就業時間の合計は{`${total}`}です。お疲れ様でした。</div>
                            
                        ):(

                            <div className=' text-2xl font-bold text-red-500 mt-5'>本日の就業時間の合計を表示します。ボタンをクリックしてください</div>
                        )}
                        
                    </ul>
                </div>
        </div>

        <StopWatch currentUser = {currentUser}  />
        
    </div>
  )
}

export default App