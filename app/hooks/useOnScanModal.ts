import React from 'react'
import { create } from 'zustand'
import { ModalType } from "../types"

interface ModalState {
    isOpen: boolean
    onOpen:(callback?:() => void) => void
    // onClose: () => void
    onClose:(callback?:() => void) => void
}


const useOnScanModal = create<ModalState>((set) => ({
    
    isOpen: false,
    onOpen: (callback?: () => void) => 
    {
    set({ isOpen: true});
    if (callback) callback();
    },
    onClose: () => set({ isOpen: false}),

    
    }
    
)) 
  



export default useOnScanModal