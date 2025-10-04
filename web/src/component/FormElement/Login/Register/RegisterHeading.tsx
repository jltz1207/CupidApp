import React from 'react'

interface Prop{
    title:string
    content?:string
}
export default function RegisterHeading({title, content} : Prop) {
  return (
    <div>
        <div className="text-[22px] mb-2 ">
            {title}
        </div>
        {content &&
        <div className="text-[14px] text-grey">
            {content}
        </div>
        }
    </div>
  )
}
