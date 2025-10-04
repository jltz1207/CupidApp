
import React from 'react'

interface Prop {
    color?:string
    title: string;
    path?: string;
    handleClick?: () => void
    isSubmit?: boolean
    width?:string
}
export default function LoginButton({ color, width, isSubmit, title, path, handleClick }: Prop) {
    const themeColor = color??'#0081AB'
    return (
            <button type={`${isSubmit ? "submit":"button"}`}  className={`cursor-pointer rounded-lg  h-[30px] flex items-center justify-center`} style={{background:themeColor,width: width?`${width}px` : '100%'}} onClick={handleClick}>
            <p className="text-[18px] text-[#FFFFFF] whitespace-nowrap ">
                {title}
            </p>
        </button>
    )
}
