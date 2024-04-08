"use client"

import React, { FC, useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import { useRouter } from 'next/navigation'
import useOnScanModal from '@/app/hooks/useOnScanModal'
import Link from 'next/link'
import Result from "../../result/Success.tsx/Success"
import {Howl,Howler} from 'howler';
import jsQR from 'jsqr'
import QRCodeScanner from '../qrcodeScanner/QrCodeScanner'
// import QRCodeScanner from '../../actions/qrcodeScanner/QrCodeScanner'



// type onScanModalProps = {
//   isOpen?: boolean,
//   onClose: () => void
//   disabled?: boolean
//   del?: boolean
// }

const OnScanModal = () => {

  const router = useRouter()
    const onScanModal = useOnScanModal()
    const [loading, setLoading] = useState(false)

    


const bodyContent = (

  <div className='flex  w-[620px] h-[580px] border-2 ml-[130px] my-5 border-blue-500 justify-center items-center'>
     <div>
        
        <QRCodeScanner />
        
        
     </div>
  </div>
)

    


    const onSubmit = () => {

    //  return(
    //   <QRCodeScanner />
      
    //  )

    // QRCodeScanner()

    }

  return (
    <div>
      <Modal 
        disabled={loading}
        isOpen={onScanModal.isOpen}
        title=''
        primaryLabel=''
        onClose={onScanModal.onClose}
        // onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        // footer={footerContent}
        onSubmit={(onSubmit)}
        
    />
    
    </div>
  )
}

export default OnScanModal