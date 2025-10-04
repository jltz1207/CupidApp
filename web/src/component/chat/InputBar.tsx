import React, { useRef, useState } from 'react'
import { BtnProp } from '../../page/Match/MatchChatRoom'

interface Prop {
    btnList?: BtnProp[]
    onSubmit: (event: React.FormEvent<HTMLFormElement>, value: string) => void
    inputValue: string
    setInputValue: (str: string) => void

}

export default function InputBar({ btnList, onSubmit, inputValue, setInputValue }: Prop) {
    const formRef = useRef<HTMLFormElement>(null);
    const themeColor = "#FFFFFF"
    const borderColor = "#3c78bd"

    const handleClick = () => {
        if (formRef.current) {
          formRef.current.requestSubmit();  // Conditionally access the DOM element
        }
      };
      
    return (

        <form  ref={formRef} className={`h-[60px] sticky   bg-[${themeColor}] bottom-12 rounded-md mx-3 border-[3px] border-[${borderColor}]  flex items-center `} onSubmit={(e) => onSubmit(e, inputValue)}>
            <input  type="text" value={inputValue} onChange={e => { setInputValue(e.target.value) }} className={`pl-2  h-[2.5rem] bg-[${themeColor}] focus:outline-none w-full border-0`} />

            <div className={`h-full  bg-[${themeColor}]  flex items-center justify-center cursor-pointer py-2`}>
                <div className="h-full flex gap-2">
                    {btnList?.map((btn, idx) => (btn.ButtonDiv()))}
                    <div onClick={handleClick} className="w-10 h-10 p-1">
                            <img className="w-full h-full" src={"/asset/button/chatroom/send.png"} />

                    </div>
                </div>

            </div>
        </form>
    )
}
