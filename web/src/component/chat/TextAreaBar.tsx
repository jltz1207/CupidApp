import React, { useState } from 'react'
import { BtnProp } from '../../page/Match/MatchChatRoom'
import { TextArea } from 'semantic-ui-react'


interface Prop {
    btnList?: BtnProp[]
    inputValue: string
    setInputValue: (str: string) => void
    error?: string;

}

export default function TextAreaBar({error, btnList, inputValue, setInputValue }: Prop) {
    const themeColor = "#FFFFFF"
    const borderColor = "#3c78bd"

    
    return (

        <div className={`h-[180px] w-full relative    bg-[${themeColor}] rounded-md border-[3px] border-[${borderColor}]  px-1 `} >
            <textarea value={inputValue} onChange={e => { setInputValue(e.target.value) }} className={`  h-full bg-[${themeColor}] focus:outline-none w-full`} />
            {btnList && <div className="absolute bottom-1 right-1 ">
                {btnList.map((item, idx) => {
                    return item.ButtonDiv()
                })}
            </div>}
            {error && <p className="msg-warning">{error}</p>}

        </div>
    )
}
