"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {

  const router = useRouter()

  // const handleOk = () => {

  //   router.push("/")


  // }

  return (
      <div className=' border-2 border-green-400 w-[600px] h-[300px] text-center mt-[50px] mr-10  '>
        <div>QRコードが読み込めました</div>
        <div>勤務を開始します</div>
        {/* <button className='' onClick={handleOk}>OK</button> */}
    </div>
  )
}

export default page