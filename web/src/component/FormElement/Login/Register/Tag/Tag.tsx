import React, { useEffect, useState } from 'react'
import { Id_Name } from '../../../../../Model/Id_Name'

interface Prop {
    data: Id_Name
    color?: string
    handleClick: () => void
    clicked: boolean
}
export default function Tag({ clicked, handleClick, data, color }: Prop) {

    const [isClicked, setClicked] = useState<Boolean>(clicked);
  
    const onClick = () => {
        handleClick();
        setClicked(!isClicked);
    }

    return (

        <div onClick={onClick} className={`border-2 ${isClicked ? "border-tag-red" : "border-tag-grey"} rounded-lg flex items-center justify-center whitespace-nowrap px-2 py-1 `}>
            <span className={` ${isClicked ?"text-tag-red":"text-tag-grey"}`} >{data.name} </span>
        </div>
    )

}
