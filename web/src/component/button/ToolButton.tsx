import React from 'react'
interface Prop {
  imgSrc: string
  handleClick: () => void
  subDiv?: () => JSX.Element | null

}

export default function ToolButton({ subDiv, imgSrc, handleClick }: Prop) {
  return (
    <div className="w-12 h-12 relative rounded-full flex items-center justify-center bg-[#FFFFFF] drop-shadow-xl cursor-pointer"  >
      <img src={imgSrc} className=" w-8 h-8" onClick={handleClick}/>
      {subDiv && subDiv()}

    </div>
  )
}
