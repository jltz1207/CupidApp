import React from 'react'

import { ChangeEvent, useEffect } from "react";
const errorMsg = {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '-2px'
}
interface Props<T> {
    title?: string;
    name: string;
    isRequired: boolean;
    setRecord: (input: T) => void;
    record: T;
    error?: string;
    value?: string | number | readonly string[] | undefined
    handleClick?: () => void
    width?: string;
    readonly?: boolean;
    clickonly?:boolean;
    id?:string;
    handleValidation?: (field: string, value: any) => void
    
}

export const InputElement = <T extends {}>({handleValidation, id, clickonly, width, handleClick, value, name, title, isRequired, setRecord, record, error, readonly}: Props<T>) => {

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (handleValidation ) handleValidation(name, value)
        setRecord({ ...record, [name]: value })
      

    }


    const work = () => {
        //console.log("input clicked")
        //console.log(handleClick)
        if (handleClick) {

            handleClick()
        }
    }




    return (
        <div className="flex flex-col" >
            <div className="mb-1">
                <label>
                    <p className={`whitespace-nowrap ${isRequired ? "text-[#CC311B]" : ""}`}>
                        {isRequired && title && "*"}
                        {title}
                    </p>

                </label>
            </div>
            <div>

            <input id={id} style={{ width: width ? `${width}` : '100%' }} readOnly={readonly||clickonly} onClick={work} className={` ${readonly ? "bg-[#D9D9D94D]" : ""}  h-[40px]  border-2 rounded-lg border-[#ACACAC] pl-3`} value={value || ""} name={name} onChange={handleChange} />
            {error && <p className="msg-warning">{error}</p>}
            </div>


        </div>
    )
}