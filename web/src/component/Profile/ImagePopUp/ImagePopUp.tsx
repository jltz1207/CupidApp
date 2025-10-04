import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { OVERLAY_STYLES } from '../../../Model/CSS/Style';

interface Prop {
    src: string
    isOpen: boolean
    setOpen:(b:boolean)=>void
}



export default function ImagePopUp({ isOpen, setOpen, src }: Prop) {
    
 
    
    if (!isOpen)
        return null;

    return ReactDOM.createPortal(
            <div style={OVERLAY_STYLES as React.CSSProperties} onClick={()=>{
                setOpen(false)
            }} >
                <img className=" bg-opacity-50 backdrop-filter backdrop-blur-sm fixed top-[50%] left-[50%] z-50 translate-y-[-50%] translate-x-[-50%]" src={src} />
            </div >,
        document.body
    );
}
