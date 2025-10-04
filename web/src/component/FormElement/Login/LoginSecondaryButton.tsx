import React from 'react'
interface prop{
    title:string
    handleClick:()=>void
}
export default function LoginSecondaryButton(p:prop) {
    return (
        <div className='flex justify-center'>
            <p onClick={p.handleClick} className="cursor-pointer border-b-2 border-[#0081AB] text-[#0081AB]">
                {p.title}
            </p>
        </div>
    )
}
