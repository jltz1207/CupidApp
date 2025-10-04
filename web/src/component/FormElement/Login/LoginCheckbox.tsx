import React, { useState } from 'react'
import { LoginModel } from '../../../Model/User';


interface Props {
    title: string;
    value: boolean;
    name:string;
    record: LoginModel;
    setRecord: React.Dispatch<React.SetStateAction<LoginModel>>
}

export default function LoginCheckbox({ title, value,record, setRecord, name }: Props) {
    const checkedSrc = "/asset/login/checkbox/blackChecked.png"
    const notCheckedSrc = "/asset/login/checkbox/blackCheckbox.png"

    const onChange=(b:boolean)=>{
      setRecord((prev)=>{
        return {...prev, [name]:b}
      })
    }


    return (
        <div className="flex items-center gap-1">
            <img src={value ? checkedSrc : notCheckedSrc} onClick={() => onChange(!value)} />
            <span className="text-[13px] text-trans-gray ">
                {title}
            </span>
        </div>
    )
}
