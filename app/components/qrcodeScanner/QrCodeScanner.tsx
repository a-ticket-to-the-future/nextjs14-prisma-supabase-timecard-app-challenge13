"use client"

import React, { FC, useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import Link from 'next/link'
// import { Result } from 'postcss'
// import Result from '../../result/Success'
import { useRouter } from 'next/navigation'
/// <reference types="@types/howler" />

import {Howl,Howler} from 'howler';
// import from '../../../public/sound/scanComplete.mp3'

import { QRCodeSVG } from "qrcode.react"
import useOnScanModal from '@/app/hooks/useOnScanModal'
import App from '../App'
// import Success from "@/app/result/Success"
import Success2 from '@/app/result/Success2'
// {///* <div>
//           <QRCodeSVG value={`http://localhost:3000/Result`} size={224}/>
//         </div> */}

type Props = {
  setWorkingState: (state:boolean) => void
  // setIsCameraOn:(state:boolean) => void
}




// import {useQRCode} from "react-qr-reader"

//React18以降は:FC<>で良いらしい

const QRCodeScanner:FC<Props> = ({setWorkingState}) => {

    // const {result} = useQRCode()

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const [onSound,setOnSound] = useState(false)
    const onScanModal = useOnScanModal()


    
    

    useEffect(() => {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: {ideal: 300},
          height: { ideal: 300},
        },
      }
      const currentVideoRef = videoRef.current
      //　デバイスのカメラにアクセする
      navigator.mediaDevices
        .getUserMedia(constraints).then((stream) => {
          // デバイスのカメラにアクセすることに成功したら、video要素にストリームをセットする
          if (videoRef.current){
            videoRef.current.srcObject = stream
            videoRef.current.play()
            scanQrCode()

            
          }
        })
        .catch((error) => console.error('Error accessing media devices:', error))


        // 　2024年4月8日示された通りここからコメントアウトする
        


        //　コンポーネントがアンマウントされたら、カメラのストリームを停止する
        return () => {
          if (currentVideoRef && currentVideoRef.srcObject) {
            const stream = currentVideoRef.srcObject as MediaStream
            const tracks = stream.getTracks()
            tracks.forEach((track) => track.stop())
          }
        }

    },[setWorkingState(true),setWorkingState(false)])
    //　ここまで

    const scanQrCode = async () => {

      const sound = new Howl({
        src:['/sound/scanComplete.mp3'],
      })
      // setOnSound(sound)

      const canvas = canvasRef.current
      const video = videoRef.current
      if (canvas && video) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          //　カメラの映像をcanvasに描画する
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          //　QRコードをスキャンする
          const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height)
          if (qrCodeData) {

            // const res = await fetch('http://localhost:3000/api/timecard/scanId',{
            //   cache:"no-store",
            // })

            // console.log(res)

            //　2024年4月8日示された通りコメントアウトする
            // //　スキャンされた内容を確認する
            // if (qrCodeData.data !== 'http://localhost:3000/Result') {
            //   setError('対応していないQRコードです')
            //   setTimeout(scanQrCode, 100) //　スキャンの頻度を制限
            //   return
            // }
            // console.log(qrCodeData.data)
            // setResult(qrCodeData.data)
            // router.push(qrCodeData.data)
            // sound.play()

            // sound.once("end", () => {
            //     if (videoRef.current && videoRef.current.srcObject) {
            //       const stream = videoRef.current.srcObject as MediaStream;
            //       const tracks = stream.getTracks();
            //       tracks.forEach((track) => track.stop());
            //     }
            //   });
            // return
            //ここまで
            //一旦ここから
            const userIdData = qrCodeData.data
            // console.log({userIdData})
            // Timecardテーブルに"userID"が存在するか確認
            const res = await fetch("http://localhost:3000/api/timecard/scanId",{
              method:"POST",
              headers:{
                "Content-Type":"application/json",
              },
              body:JSON.stringify({userIdData}),
            })
            //ここまでをコメントアウトする
            // const res = await fetch('http://localhost:3000/api/timecard/scanId',{
            //   cache:'no-cache'
            // })
            const checkedUserData = await res.json()
            console.log(checkedUserData)

            // if (checkUserId !== null) {
            //   console.log('ユーザーデータが存在しません')
            // } else {

            //   console.log(checkUserId); 
            // }
            setResult(checkedUserData)
            setWorkingState(true);
            sound.play()

            sound.once("end", () => {
                if (videoRef.current && videoRef.current.srcObject) {
                  const stream = videoRef.current.srcObject as MediaStream;
                  const tracks = stream.getTracks();
                  tracks.forEach((track) => track.stop());
                }
              });
               setWorkingState(false)
               
               onScanModal.onClose()



            }

          }
          setTimeout(scanQrCode, 50)
          // requestAnimationFrame(scanQrCode)
        }

            
           

      }

    
    
    

  return (
    <div>
    <div>
      {!result && (
        <div className=' flex justify-center'>
          <div className=' relative h-[300px] w-[300px]'> 
            <video ref={videoRef} autoPlay playsInline className=' absolute left-0 top-0 -z-50 h-[300px] w-[300px]' />
            <canvas ref={canvasRef} width='300' height='300' className=' absolute left-0 top-0' />
          </div>
        </div>
      )}

      {result && (
        <div className='flex flex-col justify-center'>
          {/* <Link href={result}>
            <button className=' text-blue-600 border-blue-300'>push</button>
          </Link>
          <Result /> */}
          {/* <Success2 id={} userId={} startedAt={} endedAt={} updatedAt={} /> */}
          
        </div>
      )}
      {error && <p className=' text-center text-xs text-red-500'>{error}</p>}
    </div>

      
    </div>
  )
}

export default QRCodeScanner