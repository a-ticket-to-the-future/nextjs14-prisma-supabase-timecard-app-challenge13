"use client"

import React, { JSXElementConstructor, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import prisma from '../lib/prismaClient';
import { User } from '../types/types';
import { Timecard } from '../types/types';
import getCurrentUser from '../actions/getCurrentUser';
import axios from 'axios';
import { any, object, tuple } from 'zod';
import moment, { utc } from 'moment';
import momentTimezone from 'moment-timezone';
import StopWatch from './stopwatch/StopWatch';
// import DiffedSubTotal from '../actions/diffedSubTotal/DiffedSubTotal';
import { list } from 'postcss';
// import { error } from 'console';
import { CSVLink } from 'react-csv';
// import ReactCsvTotal from 'react-csv-total';
// import QRCode from 'next-qrcode' 
// import { url } from 'inspector';

import QRCode, { QRCodeSVG } from 'qrcode.react';
import { Data } from 'react-csv/lib/core';
// import OnScan from './onScan/OnScan';
// import OnScan from './onScan/OnScan';


import onScanModal from './modals/onScanModal';
import useOnScanModal from '../hooks/useOnScanModal';
import Modal from './modals/Modal';
import QRCodeScanner from './qrcodeScanner/QrCodeScanner';
import jsQR from 'jsqr';
import {Howl,Howler} from 'howler';
import { useRouter } from 'next/navigation'
// import { QRCode } from 'qrcode.react';
// import { QRCode } from 'qrcode.react';
// import { v4 as uuidv4 } from 'uuidv4'; // uuidv4 ライブラリの場合




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

interface onScanModalProps {
    value:string
    onScan:(data:any) => void
}

export interface ModalType {
    isOpen: boolean
    onOpen:(callback?: ()=> void) => void
    onClose:(callback?: ()=> void) => void
}

// const QRCode = React.lazy(() => import('next-qrcode'));

interface Canvas {
    willReadFrequently?: boolean;
  }

  type QRCode = any

const App:React.FC<AppProps> =  ({currentUser},props:onScanModalProps) => {

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
    const [headers, setHeaders] = useState([
        '開始時間',
        '停止時間',
        '小計',
        // '合計',
        
    ])
    const [csvDownloadData, setCsvDownloadData] = useState({})
    // const [headers2,setHeaders2] = useState(['合計'])

    const [isOpen, setIsOpen] = useState(false)
    const onScanModal = useOnScanModal()
    // const { modal, openModal, closeModal } = useModal()
    //　カメラの状態を管理する状態変数
    const [isCameraOn, setIsCameraOn] = useState(false)
    //　カメラのストリームを保持する状態変数
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    // const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [result, setResult] = useState('')
    const router = useRouter()
    const [isScanned,setIsScanned] = useState(false)
    const [scanedData, setScanedData] = useState(null)
    const [qrCodeData, setQrCodeData] = useState("")
    const [endScanData, setEndScanData] = useState("")
    const [cameraOn, setCameraOn] = useState(false)
    const [isCameraReady, setIsCameraReady] = useState(false)
    const [isTimecardEndReady, setIsTimecardEndReady] = useState(false)
    const [endTimeScan,setEndTimeScan] = useState(false)
    const [cameraAndQrcode, setCameraAndQrcode] = useState(false)
    const [qrReadCount, setQrReadCount] = useState(0)
    const [qrData, setQrData] = useState('')
    // const [code3, setCode3] = useState<QRCode | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [lastScanTime, setLastScanTime] = useState(0)
    const [nextQrCodeData, setNextQrCodeData] = useState("")
    const [sample, setSample] = useState("")

    // type QRCode = any
    
    // const turnOnCamera = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({video: true})
    //         if (videoRef.current) videoRef.current.srcObject = stream
    //         setCameraStream(stream)
    //         setIsCameraOn(true)
    //     } catch (error) {
    //         console.error('カメラのアクセスに失敗しました',error)
    //     }
    // }

    // //　カメラをオフにする関数
    // const turnOffCamera = () => {
    //     if(videoRef.current && videoRef.current.srcObject) {
    //         // cameraStream.getTracks().forEach(track => track.stop())
    //         // setCameraStream(null)
    //         const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    //         tracks.forEach(track => track.stop())
    //         videoRef.current.srcObject = null

    //     }
    //     setIsCameraOn(false)
    // }

    // useEffect(() => {
    //     return () => {
    //         if(cameraStream) {
    //             cameraStream.getTracks().forEach(track => track.stop())
    //         }
    //     }
    // },[cameraStream])

    // //　カメラの状態が変わったときに実行される副作用
    // useEffect(() => {
    //     return () => {
    //         //　コンポーネントのアンマウント時にカメラをオフにする
    //         turnOffCamera()
    //     }
    // },[])

    // useEffect(() => {
    //     if(isCameraOn && cameraStream && videoRef.current){
    //         videoRef.current.srcObject = cameraStream
    //     }

    // },[isCameraOn, cameraStream])


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
                body:JSON.stringify({userId,savedStartedTime,startedData})
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
                body:JSON.stringify({startedData,formattedTime})

            })

            const data2 = await res2.json()
            // console.log(data2)

            const receivedSubTotal = data2.subTotal.subTotal
            console.log(receivedSubTotal);
            setSubTotal(receivedSubTotal);
            setCameraOn(false)

            
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

    
    const handleWorkingStart = async () => {

        setCameraOn(true)

        if(isCameraOn){

            if(videoRef.current && videoRef.current.srcObject){
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                tracks.forEach(track => track.stop());
                // videoRef.current.srcObject = null
            } 
            setIsCameraOn(false)
            console.log("こっちが動いているよ")

        } else {
            if(qrReadCount === 0) {
            try {
                const constraints = {
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 300},
                        height: { ideal:300},
                    },
                }

                const sound = new Howl({
                    src:['/sound/scanComplete.mp3'],
                  })

                const stream = await navigator.mediaDevices.getUserMedia(constraints)
                if(videoRef.current){
                    videoRef.current.srcObject = stream
                    videoRef.current.play()
                    // await scanQrCode()
                      setCameraOn(true)
                      
                        // try {
                        //     if(cameraOn){
                        const startScan = async () => {

                            if(qrCodeData === "" && startedData === "" && !workingState) {

                                const sound = new Howl({
                                    src:['/sound/scanComplete.mp3'],
                                  })
                        
                                const canvas = canvasRef.current
                                const video = videoRef.current
                                if(canvas && video ){
                                    const context = canvas.getContext('2d')
                                    setCurrentTime(Date.now())
                                    if (context) {
                                        
                                        // context.clearRect(0, 0, canvas.width, canvas.height);
                                        
                                        context.drawImage(video,0,0,canvas.width,canvas.height)
                                        // console.log(context)
                                        const imageData = context.getImageData(0,0,canvas.width,canvas.height)
                                       
                                         const  code =jsQR(imageData.data, imageData.width, imageData.height)
                                         
                                         
                                        if ( code ) {
                                            
                                            console.log('QRコードが検出されました', code.data)
                                            // setIsScanned(true)
                                           setQrCodeData (code.data)
                                            setWorkingState(true)
                                            if (videoRef.current && videoRef.current.srcObject) {
                                                const stream = videoRef.current.srcObject as MediaStream;
                                                const tracks = stream.getTracks();
                                                tracks.forEach((track) => track.stop());
                                                videoRef.current.srcObject = null
                                              // tracks[0].stop()
                                              }
                                            sound.play()
                                            sound.once("end", () => {
                                                if (videoRef.current && videoRef.current.srcObject) {
                                                  const stream = videoRef.current.srcObject as MediaStream;
                                                  const tracks = stream.getTracks();
                                                  tracks.forEach((track) => track.stop());
                                                  videoRef.current.srcObject = null
                                                // tracks[0].stop()
                                                }
                                                setIsCameraOn(false)
                        
                                                return
                                              });
                            
                                            setResult(code.data)
                                            const codeData = code.data
                                            
                                            const res = await fetch('http://localhost:3000/api/timecard/scanId',{
                                                method:"POST",
                                                headers:{
                                                    "Content-Type":"application/json",
                                                },
                                                body:JSON.stringify({codeData}),
                                            })
                            
                                            const checkedScanData = await res.json();
                            
                                            console.log(checkedScanData);
                                            // scanQrCode()
                                            setUserId(checkedScanData.id)
                                            setStartedData(checkedScanData);
                                            const convertedStartTime = moment(checkedScanData.startedAt)
                                            setSaveStartTime(convertedStartTime.format('YYYY/MM/DD HH:mm:ss'))
                                            // setIsCameraOn(false)
                    
                                            // setQrCodeData("")
                                            setIsScanned(false)
                                            setQrCodeData("")
                                            setCameraOn(false)
                                            setQrReadCount(qrReadCount + 1);
                                            return;   
                                        }

                    // context.clearRect(0, 0, canvas.width, canvas.height);

                                    }
                                    
                                    // if(!isScanned) {
                        
                                        // setTimeout(handleWorkingStart,50)
                                    // }
                                       
                                    
                                    // requestAnimationFrame(scanQrCode)
                        
                                   
                        
                                         
                                    
                                }
                            }

                            const timeoutId = setTimeout(startScan,50)
                            // console.log(timeoutId)

                        }
                        //       scanQrCode()
                        //     } else {
                        //         console.log('なぜかこっちになった')
                        //     }
                        // } catch (error) {
                        //     console.log('カメラが起動していません')
                        // }
                        startScan()
                        setIsScanned(false)
                                            setQrCodeData("")
                                            setCameraOn(false)
                                            setLastScanTime(currentTime)
                       
                    }
                      

                      
                     

                    
                    // setIsCameraOn(false)

                     

                //  setTimeout(scanQrCode, 100)
                //  requestAnimationFrame(scanQrCode)

                //  setIsCameraOn(false)
                }

                
                // sound.play()
                    
                //     sound.once("end", () => {
                //    if (videoRef.current && videoRef.current.srcObject) {
                //      const stream = videoRef.current.srcObject as MediaStream;
                //      const tracks = stream.getTracks();
                //      tracks.forEach((track) => track.stop());
                //    }
                //  });

             catch (error) {
                console.error('カメラのアクセスに失敗しました',error)
            }

        } 
    }
}

    // const qrCodeScan = () => {
    //     const canvas = canvasRef.current
    //                         const video = videoRef.current
    //                         if(canvas && video ){
    //                             const context = canvas.getContext('2d')
    //                             if (context) {
                    
    //                                 context.drawImage(video,0,0,canvas.width,canvas.height)
    //                                 const imageData = context.getImageData(0,0,canvas.width,canvas.height)
    //                                 const code = jsQR(imageData.data, imageData.width, imageData.height)
    //                                 if ( code ) {
    //                                     console.log('QRコードが検出されました', code.data)
    //                                     // setIsScanned(true)
    //                                    setQrCodeData (code.data)
    //                                     setWorkingState(false)
    //                                     // if (videoRef.current && videoRef.current.srcObject) {
    //                                     //     const stream = videoRef.current.srcObject as MediaStream;
    //                                     //     const tracks =  stream.getTracks();
    //                                     //     tracks.forEach((track) => track.stop());
    //                                     //     videoRef.current.srcObject = null
    //                                     //   // tracks[0].stop()
    //                                     //   }
                                        
                        
    //                                     setResult(code.data)
    //                                     const codeData = code.data
    //                                     const startedId = startedData
    //                                     console.log(startedId)
    //                                 }
    //                             }
    //                             }
    // }

    const cameraStart = async () => {

        setQrCodeData("")
        setIsScanned(false)
        setCameraOn(true)

        

        try{
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 300},
                    height: { ideal:300},
                },
            }

            const sound = new Howl({
                src:['/sound/scanComplete.mp3'],
              })
    
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            if(videoRef.current){
                videoRef.current.srcObject = stream
                videoRef.current.play().then(() => {

                    // console.log(qrCodeData)
                    // console.log(scanedData)
                    if (!isCameraReady){
                        setIsCameraReady(true);
                        // console.log(isCameraReady)
                        // //  qrCodeScan()
                        // console.log("ここまでは動いてるよ")
                        handleWorkend2()
                }
                

                    
                    
                    
                })
                // console.log(isCameraReady)
                    // await scanQrCode()
                    setIsTimecardEndReady(true)
                
    
        } else { 
            console.log("エラーですね")
        }

        } catch (error) {
            console.log("カメラのアクセスに失敗しました",error)
        }
    
}

//　handleWorkEndとして処理を記述し直す//2024年4月16日
const handleWorkEnd = async () => {
    setIsCameraReady(true)
    if (isCameraReady === false) {
        handleCameraOff()
    } else if(isCameraReady === true) {
        cameraStart();
        setCameraAndQrcode(true)
        
    }
}


//
    const qrCodeScan = async () => {

        const sound = new Howl({
            src:['/sound/scanComplete.mp3'],
          })
          
              //2024年4月15日 一旦コメントアウト
            const canvas2 = canvasRef.current
            const video2 = videoRef.current
            if(canvas2 && video2 ){
                const endContext = canvas2.getContext('2d')
                // const uniqueIdntifier = uuidv4()
                const currentTime = Date.now()
                
                
                if (endContext) {
                    // endContext.clearRect(0, 0, canvas2.width, canvas2.height);
                    endContext.drawImage(video2,0,0,canvas2.width,canvas2.height)
                    console.log(endContext)
                    // requestAnimationFrame(qrCodeScan);
                    requestAnimationFrame(()=> {

                        const imageData2 = endContext.getImageData(0,0,canvas2.width,canvas2.height)
                        console.log("qrCodeScanの中のimageData2")
                        console.log(imageData2)
                        // const endCode = jsQR(imageData2.data, imageData2.width, imageData2.height)
                        
    
                            const endCode = jsQR(imageData2.data, imageData2.width, imageData2.height) 
                            console.log(endCode)
                            if ( endCode ) {
                                const scannedCodeData = endCode.data
                                const timeDifference = currentTime - lastScanTime;
                                console.log(scannedCodeData)
                                console.log(timeDifference)
                                if(timeDifference === 0){
        
                                    console.log("同じ時刻に2度同じQRコードを読み込んでいます。")
                                    return;
        
                                }else if(timeDifference !== 0) {
        
                                    // setCode(endCode)
                                    console.log('2度目のQRコードが検出されました', scannedCodeData)
                                    // console.log(scannedCodeData)
                                    // setIsScanned(true)
                                //    setQrCodeData (endCode.data) 
                                    setNextQrCodeData(scannedCodeData)
                                    setWorkingState(false)
                                    // if (videoRef.current && videoRef.current.srcObject) {
                                    //     const stream = videoRef.current.srcObject as MediaStream;
                                    //     const tracks =  stream.getTracks();
                                    //     tracks.forEach((track) => track.stop());
                                    //     videoRef.current.srcObject = null
                                    //   // tracks[0].stop()
                                    //   }
                                    
                                    if (videoRef.current && videoRef.current.srcObject) {
                                        const stream = videoRef.current.srcObject as MediaStream;
                                        const tracks = stream.getTracks();
                                        tracks.forEach((track) => track.stop());
                                        // videoRef.current.srcObject = null
                                      // tracks[0].stop()
                                      }
                
                                    setResult(endCode.data)
                                    const codeData = endCode.data
                                    console.log(codeData)
                                    setEndTimeScan(true)
                                    setCameraAndQrcode(true)
        
        
                                     //ここからDBへの保存と計算と表示のための記述を予定
                                     
                                     console.log('いったん確認する')                            
                                     
                                     sound.play()
                                     sound.once("end", () => {
                                        if (videoRef.current && videoRef.current.srcObject) {
                                          const stream = videoRef.current.srcObject as MediaStream;
                                          const tracks = stream.getTracks();
                                          tracks.forEach((track) => track.stop());
                                          videoRef.current.srcObject = null
                                        // tracks[0].stop()
                                        }
                                        setIsCameraOn(false)
                                    
                                        return;
                                    })
                
                                }
                                // endContext.clearRect(0, 0, canvas2.width, canvas2.height);
                                
                            } else {
                                console.log("endCodeがnullになっているようです")
                                
                    }
                        
                    })

        }
    }
            
}
     
    const handleWorkingEnd = async () => {

        setCameraOn(true)

        if(isCameraOn){

            if(videoRef.current && videoRef.current.srcObject){
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null
            } 
            setIsCameraOn(false)
            console.log("こっちが動いているよ")

        } else {
            
            try {
                const constraints = {
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 300},
                        height: { ideal:300},
                    },
                }

                const sound = new Howl({
                    src:['/sound/scanComplete.mp3'],
                  })

                const stream = await navigator.mediaDevices.getUserMedia(constraints)
                if(videoRef.current){
                    videoRef.current.srcObject = stream
                    videoRef.current.play()
                    // await scanQrCode()
                    setQrCodeData("")
                    setIsScanned(false)
                    console.log(qrCodeData)
                    console.log(scanedData)
                    if (isCameraOn && videoRef.current && videoRef.current.srcObject) {
                        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                        tracks.forEach(track => track.stop());
                        videoRef.current.srcObject = null;
                        setIsCameraOn(false);
                    }

                    setIsCameraReady(true)
                    const endScan = async () => {
                        setQrCodeData("")
                        setIsScanned(false)
                        if (isCameraOn && videoRef.current && videoRef.current.srcObject) {
                            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                            tracks.forEach(track => track.stop());
                            videoRef.current.srcObject = null;
                            setIsCameraOn(false);
                        }

                        if(startedData && workingState ) {
                            const sound = new Howl({
                                src:['/sound/scanComplete.mp3'],
                              })
                            
                              //2024年4月15日 一旦コメントアウト
                            const canvas = canvasRef.current
                            const video = videoRef.current
                            if(canvas && video ){
                                const context = canvas.getContext('2d')
                                if (context) {
                                    // context.clearRect(0, 0, canvas.width, canvas.height);
                                    
                                    context.drawImage(video,0,0,canvas.width,canvas.height)
                                    const imageData = context.getImageData(0,0,canvas.width,canvas.height)
                                    const code = jsQR(imageData.data, imageData.width, imageData.height)
                                    if ( code ) {
                                        console.log('QRコードが検出されました', code.data)
                                        // setIsScanned(true)
                                       setQrCodeData (code.data)
                                        setWorkingState(false)
                                        // if (videoRef.current && videoRef.current.srcObject) {
                                        //     const stream = videoRef.current.srcObject as MediaStream;
                                        //     const tracks =  stream.getTracks();
                                        //     tracks.forEach((track) => track.stop());
                                        //     videoRef.current.srcObject = null
                                        //   // tracks[0].stop()
                                        //   }
                                        
                        
                                        setResult(code.data)
                                        const codeData = code.data
                                        const startedId = startedData
                                        console.log(startedId)

                                        //2024年4月15日　ここまでコメントアウト
                                        // qrCodeScan()
                                        
                                        const res = await fetch('http://localhost:3000/api/timecard/endScanId',{
                                            method:"PUT",
                                            headers:{
                                                "Content-Type":"application/json",
                                            },
                                            body:JSON.stringify({codeData,startedData}),
                                        })
                        
                                        const checkedEndScanData = await res.json();
                        
                                        console.log(checkedEndScanData);
                                        console.log(checkedEndScanData.endScanData.endedAt)
                                        // scanQrCode()
                                        const convertedEndTime = moment(checkedEndScanData.endScanData.endedAt)
                
                                        setSaveEndTime(checkedEndScanData.endScanData.endedAt)
                                // const startTime = convertedTime.add(9,"hours")
                                console.log(convertedEndTime.format('YYYY/MM/DD HH:mm:ss'));
                                setSavedEndedTime(convertedEndTime.format('YYYY/MM/DD HH:mm:ss'))
                                        
                                        // setIsCameraOn(false)
                                        return;   
                                    }
                                }
                                
                                // if(!isScanned) {
                    
                                    // setTimeout(handleWorkingEnd,50)
                                // }
                                   
                                
                                // requestAnimationFrame(scanQrCode)
                    
                               
                    
                                    
                                
                            }
                            
                        }
                        
                        const timeoutId2 = setTimeout(endScan,50)
                        // console.log(timeoutId2)
                       
                    }

                      
                        // try {
                        //     if(cameraOn){

                        //       scanQrCode()
                        //     } else {
                        //         console.log('なぜかこっちになった')
                        //     }
                        // } catch (error) {
                        //     console.log('カメラが起動していません')
                        // }
                        // scanQrCode()
                      

                      
                     

                    
                    // setIsCameraOn(false)
                    if (isCameraOn && videoRef.current && videoRef.current.srcObject) {
                        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                        tracks.forEach(track => track.stop());
                        videoRef.current.srcObject = null;
                        setIsCameraOn(false);
                    }
                    setQrCodeData("")
                    setIsScanned(false)
                    setWorkingState(false)
                    setQrCodeData("")
                    await endScan() 
                    sound.play()
                    sound.once("end", () => {
                        if (videoRef.current && videoRef.current.srcObject) {
                          const stream = videoRef.current.srcObject as MediaStream;
                          const tracks = stream.getTracks();
                          tracks.forEach((track) => track.stop());
                          videoRef.current.srcObject = null
                        // tracks[0].stop()
                        }
                        setIsCameraOn(false)

                        return
                      });
                    setIsCameraOn(false)
                //  setTimeout(scanQrCode, 100)
                //  requestAnimationFrame(scanQrCode)

                //  setIsCameraOn(false)
                }

                
                // sound.play()
                    
                //     sound.once("end", () => {
                //    if (videoRef.current && videoRef.current.srcObject) {
                //      const stream = videoRef.current.srcObject as MediaStream;
                //      const tracks = stream.getTracks();
                //      tracks.forEach((track) => track.stop());
                //    }
                //  });

            } catch (error) {
                console.error('カメラのアクセスに失敗しました',error)
            }

        } 
    }
    
    
    

    const handleCameraOff = () => {

        

            if (videoRef.current && videoRef.current.srcObject) {
                const stream = (videoRef.current.srcObject as MediaStream)
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null
              // tracks[0].stop()
              setIsCameraOn(false)
              setCameraOn(false)
              

            
            
            
           


            }
        }



    //　一旦、endの処理を一から記述する

    const handleWorkend2 = async () => {


        setCameraOn(true)
        // console.log(cameraOn,"こっちも動いたよ")

        // if ( isCameraOn ) {

        //     if(videoRef.current && videoRef.current.srcObject){
        //         const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        //         tracks.forEach(track => track.stop());
        //         videoRef.current.srcObject = null
        //     }

        //     setIsCameraOn(false)
        //     console.log("こっちが動いているよ")

       

            // if(qrReadCount > 0) {
                try {
                    // const constraints = {
                    //     video: {
                    //         facingMode: 'environment',
                    //         width: { ideal: 300},
                    //         height: { ideal:300},
                    //     },
                    // }

                    // const sound = new Howl ({
                    //     src:['/sound/scanComplete.mp3'],
                    // })

                    
                    // console.log(qrCodeData)
                    // console.log(startedData)
                    // console.log(workingState)
                    
                    // const endScan = () => {
                        // if(qrCodeData === "" && startedData !== "" && workingState){
                            // console.log("ここも動いてるよ")

                            const sound = new Howl({
                                src:['/sound/scanComplete.mp3'],
                            })

                            const canvas2 = canvasRef.current
                            const video2 = videoRef.current
                            if(canvas2 && video2 ){
                                const context = canvas2.getContext('2d')
                                setCurrentTime(Date.now())
                                if (context) {
                                    context.clearRect(0, 0, canvas2.width, canvas2.height)

                                    context.drawImage(video2,0,0,canvas2.width,canvas2.height)

                                    const ImageData2 = context.getImageData(0,0,canvas2.width,canvas2.height)

                                    const code2 = jsQR(ImageData2.data, ImageData2.width, ImageData2.height)

                                    if ( code2 ) {
                                        console.log('QRコードが検出されました', code2.data)

                                        setQrCodeData(code2.data)
                                        setWorkingState(false)

                                        // if ( videoRef.current && videoRef.current.srcObject) {
                                        //     const stream = videoRef.current.srcObject as  MediaStream;
                                        //     const tracks = stream.getTracks();
                                        //     tracks.forEach((track) => track.stop())
                                        //     videoRef.current.srcObject = null

                                        // }
                                        sound.play()
                                        sound.once("end",() => {
                                            if(videoRef.current && videoRef.current.srcObject){
                                                const stream = videoRef.current.srcObject as MediaStream;
                                                const tracks = stream.getTracks()
                                                tracks.forEach((track) => track.stop())
                                                videoRef.current.srcObject = null 
                                            }

                                            setIsCameraOn(false)

                                            return
                                        });

                                        setResult(code2.data)
                                        const codeData2 = code2.data

                                        //　2024年4月23日ここから下に処理を記述
                                        timeCardEnd()
                                        // const res = await fetch('')

                                        return;


                                    }
                                    context.clearRect(0,0, canvas2.width, canvas2.height)
                                }
                            }

                             const timeoutId2 = setTimeout(handleWorkend2,50)

                        
                        // handleWorkend2
                        setIsScanned(false)
                        setQrCodeData("")
                        setCameraOn(false)
                        setLastScanTime(currentTime)

                        return;

                    // }

                } catch (error) {

                    console.error('カメラのアクセスに失敗しました',error )
                
                }
            // } 

        

    }


    // useEffect(() => {
    //     if(isCameraOn && qrCodeData === "" && cameraOn && !workingState){
    //         handleWorkingStart()
    //         setWorkingState(true)
    //         setStartedData("")
    //     } else if(isCameraOn && qrCodeData !== "" && startedData !== "" && cameraOn !== false && workingState){
    //         handleWorkingEnd()
    //         console.log("２度目はこっちの処理を走らせたい") 
            
    //     }
    // },[isCameraOn])


    // useEffect(() => {
    //     if(isCameraReady === false){
    //         handleCameraOff()
    //     } else {

    //         handleWorkend2()
    //         console.log('handleWorkEndが読み込まれました')
            
            
    //     }
        

    // },[isCameraReady])

    // useEffect ( ()=> {
    //     if(isTimecardEndReady === true && qrCodeData === ""){
    //         // setQrCodeData("")
    //         setQrCodeData("")
    //         setIsScanned(false)

    //         setIsCameraReady(true )
    //         if (isCameraReady === true) {

    //             handleWorkingEnd()
    //             console.log('useEffectにより2度目のQRコードが読み込まれました')
                
    //             return;
    //         } else {
    //             // setQrCodeData("")
    //             // setQrReadCount(qrReadCount + 1);
    //             return
    //         }
    //         }
            
        

    // },[isTimecardEndReady === true])

    // useEffect(() => {
    //     if(sample === null){
    //         cameraStart()
    //     }

    // },[sample === null])

    useEffect(()=> {
        if(workingState === true){

            timeCardEnd()
        }
        
    },[endTimeScan === true])

    // useEffect(() => {
    //     if(canvasRef.current){
    //         canvasRef.current.willReadFrequently = true
    //     }
    // },[canvasRef])

    

    


  return (
    <div className=' flex flex-col'>
        <h1 className=' text-4xl bg-green-400 text-slate-50 rounded-md font-bold px-[50px] py-[5px] text-center'>
            タイムカード
        </h1>
        {/* <OnScan  /> */}
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
                <div>
                    <QRCodeSVG value='f543d8f5-87ed-4a56-ba17-ded7e83ce040' size={224} />
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
                    <div className=' flex'>

                    <div className=' w-[200px] h-[50px] bg-orange-400 border-gray-400 border-2 mt-5 text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer mr-[200px]' onClick={handleList}>ボタン</div>
                    
                        {/* <div className=' flex gap-10'>

                            <div className=' w-[200px] h-[50px] bg-gray-400 border-gray-400 border-2 mt-5 ml-[50px] text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' onClick={handleScanOff}>カメラオフ</div>
                            <div className=' w-[200px] h-[50px] ml-[100px] bg-green-400 border-gray-400 border-2 mt-5 text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' 
                            onClick={handleScan}>
                            QRコード
                            <QRCodeScanner setWorkingState={setWorkingState}  />
                            </div>
                        </div>  */}
                        
                        {/* <div>
                            <QRCodeScanner setWorkingState={setWorkingState} />
                            <div className=' w-[200px] h-[50px] bg-gray-400 border-gray-400 border-2 mt-5 text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' onClick={handleScanOff}>カメラオフ</div>
                            
                        </div>
                    */}

                    <div className='flex'>
                    
                    <div className=' flex flex-col'>
                    <div>
                        <button 
                                onClick={handleWorkingStart}
                                className=' w-[200px] h-[50px] bg-green-400 border-gray-400 border-2 mt-5 ml-[50px] text-slate-50 text-center pt-2 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' >
                            {/* {isCameraOn ? 'カメラをオフにする' : "カメラをオンにする"} */}
                            {/* カメラをオフにする */}
                            仕事を開始する
                        </button>
                        <video ref={videoRef} autoPlay playsInline muted style={{width:'100%'}} />
                        <canvas ref={canvasRef} width="300" height="300" style={{display:"none"}} />
                        {/* <button onClick={startCamera}>カメラスタート</button> */}
                    </div>
                    <div>
                        <button 
                                onClick={handleCameraOff}
                                className=' w-[200px] h-[50px] bg-gray-400 border-8 border-green-400 mt-5  ml-[50px] text-slate-50 text-center pt-2 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' >
                            カメラをオフにする
                            {/* カメラをオフにする */}
                        </button>
                        {/* <video ref={videoRef} autoPlay playsInline muted style={{width:'100%'}} />
                        <canvas ref={canvasRef} width="300" height="300" style={{display:"none"}} /> */}
                        {/* <button onClick={startCamera}>カメラスタート</button> */}
                    </div>
                    </div>
                    <div className=' flex flex-col'>
                    <div>
                        <button 
                                onClick={cameraStart}
                                //いったん、handleWorkEndするためコメントアウト
                                // onClick={handleWorkingEnd}
                                className=' w-[200px] h-[50px] bg-blue-400 border-gray-400 border-2 mt-5 ml-[50px] text-slate-50 text-center pt-2 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' >
                            {/* {isCameraOn ? 'カメラをオフにする' : "カメラをオンにする"} */}
                            {/* カメラをオフにする */}
                            仕事を終了する
                        </button>
                        <video ref={videoRef} autoPlay playsInline muted style={{width:'100%'}} />
                        <canvas ref={canvasRef} width="300" height="300" style={{display:"none"}} />
                        {/* <button onClick={startCamera}>カメラスタート</button> */}
                    </div>
                    <div>
                        <button 
                                onClick={handleCameraOff}
                                className=' w-[200px] h-[50px] bg-gray-400 border-8 border-blue-400 mt-5 ml-[50px] text-slate-50 text-center pt-2 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' >
                            カメラをオフにする
                            {/* カメラをオフにする */}
                        </button>
                        {/* <video ref={videoRef} autoPlay playsInline muted style={{width:'100%'}} />
                        <canvas ref={canvasRef} width="300" height="300" style={{display:"none"}} /> */}
                        {/* <button onClick={startCamera}>カメラスタート</button> */}
                    </div>
                    </div>

                    

                    </div>
                    
                    </div>

                    {/* <div>
                        {!isCameraOn && (
                            <button onClick={turnOnCamera} className=' w-[200px] h-[50px] bg-green-400 border-gray-400 border-2 mt-5 ml-[50px] text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer' >カメラをオンにする</button>
                        )}
                        {!isCameraOn && (
                            <button onClick={turnOffCamera} className=' w-[200px] h-[50px] bg-gray-400 border-gray-400 border-2 mt-5 ml-[50px] text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer'>カメラをオフにする</button>
                        )}
                        {!isCameraOn && (
                            <video ref={videoRef} autoPlay playsInline style={{ width: '100%'}} />
                        )}
                    </div> */}
                    

                      

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
                {/* <div>

                <CSVLink data={handleCsvDownload} headers={headers} filename="work_hours.csv">
                            {/* <ReactCsvTotal data={data} columns={['小計']} /> */}
                            {/* <div className=' w-[200px] h-[50px] bg-orange-400 border-gray-400 border-2 mt-5 text-slate-50 text-center pt-3 font-bold rounded-md  hover:scale-105 active:scale-95 cursor-pointer'>CSV出力</div>
                </CSVLink>
                </div> */} 
                {/* */} 
        </div>

        <StopWatch currentUser = {currentUser}  />
        
    </div>
  )
}

export default App