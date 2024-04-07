"use client"

import { User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import Menu from './Menu'

type NavigationProps = {
    currentUser: User | null 
}

const Navigation:React.FC<NavigationProps> = ({currentUser}) => {
  return (
    <header className=' shadow-lg shadow-gray-100 pl-[570px]'>
        <div className=' container mx-auto flex max-w-screen-sm items-center  justify-between px-1 py-5'>
            <Link href="/" className=' cursor-pointer text-xl font-bold'>
                A ticket to the future
            </Link>

            <div className=' flex items-center justify-center space-x-2'>
                <Menu currentUser={currentUser} />
            </div>
        </div>
    </header>
  )
}

export default Navigation