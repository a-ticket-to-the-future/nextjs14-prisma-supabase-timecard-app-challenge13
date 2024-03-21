"use client"

import { User } from '@/app/types/types';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export type stopWatchProps ={
    currentUser: User | null
    // id:string | null 
    // name:string | null
    // email:string | null
    // createdAt:Date | null
    // updatedAt:Date | null
    // hashedPassword:string | null
    // children: React.ReactNode
}

const StopWatch:React.FC<stopWatchProps> = ({currentUser}) => {

    const [users, setUsers] = useState([]);
    const [timecards, setTimecards] = useState([])
    const [workingState, setWorkingState] = useState(false)
    // const [userId, setUserId] = useState("");
    const [savedStartedTime, setSavedStatedTime] = useState("")
    const [savedEndedTime, setSavedEndedTime] = useState("")
    const [saveStartTime,setSaveStartTime]= useState("")
    const [saveEndTime,setSaveEndTime] = useState("")
    const [startedData, setStartedData] = useState("")
    const [isStarted, setIsStarted] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0);
    const [savedStopWatchStartedId,setSavedStopWatchStartedId]=useState("");
    const [savedStopWatchStarted,setSavedStopWatchStarted] = useState("")
    const [measuredTime2, setMeasuredTime2] = useState("")



    // type interval = {
    //     number,
        

    // }

    // type interval = number | undefined | unknown | null;

    useEffect(()=> {



        let interval : any //interval;
        // console.log(interval)
        if(isStarted) {
            interval = setInterval(() => {
                setElapsedTime((prevElapsedTime) => prevElapsedTime + 100)
            },100)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)

    },[isStarted])


    const handleStart = async () => {
        if(!isStarted){
            setIsStarted(true)


            if (currentUser) {

                const userId = currentUser.id
        
                const stopWatchStartedRes = await fetch('http://localhost:3000/api/timecard/stopWatchStarted',{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({userId})
                })
        
                const res = await stopWatchStartedRes.json()
                console.log(res.stopWatchStarted.startedAt);
                setSavedStopWatchStartedId(res.stopWatchStarted.id)
                setSavedStopWatchStarted(res.stopWatchStarted.startedAt)
            } else {
                console.log('error');
            }
    
        } else  {
            alert('すでに開始ボタンが押されています');
        }
    }

    const handleStop = async () => {
        if(isStarted){
            setIsStarted(false)

            if(currentUser){
                const userId = currentUser.id
                const stopWatchEndedRes = await fetch('http://localhost:3000/api/timecard/stopWatchEnded',{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({userId,savedStopWatchStarted,savedStopWatchStartedId})
                })
                const stopWatchData = await stopWatchEndedRes.json()
                console.log(stopWatchData);
                const stopWatchStartedData = moment(stopWatchData.stopWatchEnded.startedAt)
                console.log(stopWatchStartedData.format('YYYY/MM/DD HH:mm:ss'))
                const stopWatchEndedData = moment(stopWatchData.stopWatchEnded.endedAt)
                console.log(stopWatchEndedData.format('YYYY/MM/DD HH:mm:ss'))
                const diff = stopWatchEndedData.diff(stopWatchStartedData,'milliseconds')
                console.log(diff)

                const date= new Date(diff)
                const hours = date.getUTCHours()
                const minutes = date.getUTCMinutes()
                const seconds = date.getSeconds()

                const formattedTime = `${hours}:${minutes}:${seconds}`
                // console.log(formattedTime);
                // setMeasuredTime(formattedTime);

                // const formattedTime = 
                console.log(formattedTime);
                setMeasuredTime2(formattedTime);


            } else {
                console.log("認証されていません")
            }
            

        } else {
            alert('スタートボタンが押されていません')
        }


    }

    const handleReset = async () => {
        
        setElapsedTime(0)
    }

    const formattedTime = () => {
        const hours = Math.floor(elapsedTime / 3600000)
        const minutes  = Math.floor((elapsedTime % 3600000) / 60000)
        const seconds = Math.floor((elapsedTime % 3600000) % 60000 / 1000)

        return `${hours}時間${minutes}分${seconds}秒`
    }

    const handleSave = async () => {
        // console.log('Saveの記述をしてね')
        if (typeof measuredTime2 === 'string' ) {

            const stopWatchDifferentialDataSave = await fetch('http://localhost:3000/api/timecard/stopWatchDifferntialDataSave',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({measuredTime2,savedStopWatchStartedId}),
            })
            const stopWatchSavedData = await stopWatchDifferentialDataSave.json()
            console.log(stopWatchSavedData)
            // alert('ストップウォッチで計測した値がDBに保存されました')
            toast.success('ストップウォッチで計測した値がDBに保存されました')
        } else {
            // alert('ストップウォッチが計測されていません')
            toast.error('ストップウォッチが計測されていません')
        }
    } 

  return ( 

        <div className=' flex flex-col mt-[160px]'>
            <h1 className=' text-4xl bg-pink-400 text-slate-50 rounded-md font-bold px-[50px] py-[5px] text-center'>
                ストップウォッチ
            </h1>
                <div className=' flex flex-col mt-[60px] gap-5'>
                        <div className=' bg-yellow-300 w-[1000px] h-[60px] flex gap-20 justify-center '>
                            <div className='  border-2 border-slate-50 rounded-lg bg-gray-300 my-1 px-5 pt-3 text-center hover:scale-105 active:scale-95 cursor-pointer' onClick={handleStart} >スタート</div>
                            <div className='  border-2 border-slate-50 rounded-lg my-1 px-5 pt-3 bg-red-500 hover:scale-105 active:scale-95 cursor-pointer' onClick={handleStop} >ストップ</div>

                            { currentUser && isStarted ? (
                            
                                <div className=' border-2 border-black  my-1 rounded-lg px-5 pt-3 text-red-500 font-bold'  >計測中</div>
                            ):
                            (
                                <div className=' border-2 border-black  my-1 rounded-lg px-5 pt-3 text-blue-600 font-bold'   >停止中</div>

                            )}
                            <div className='  border-2 border-slate-50 rounded-lg my-1 px-5 pt-3 '>経過時間: {formattedTime()}</div>
                            <div className=' border-2 border-black text-black my-1 rounded-lg px-5 pt-3 hover:scale-105 active:scale-95 cursor-pointer' onClick={handleReset} >リセット</div>
                            
                            
                        </div>

                        <div 
                            className=' mt-[60px] border bg-orange-400 text-slate-50 w-[200px] h-[50px] text-center pt-3 font-bold rounded-md hover:scale-105 active:scale-95 cursor-pointer s border-gray-400 '
                            onClick={handleSave}
                            >
                            計測した時間を保存する
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

export default StopWatch