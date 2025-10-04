import React from 'react'

interface Prop {
    isSender: boolean
    content: string
    dateTime: string
    status?: 'sent' | 'read'

}
export default function MessageBox(p: Prop) {
    return (

        <div className={` flex ${p.isSender ? "justify-end" : "justify-start"}  `}>
            <div className="flex flex-col gap-1">
                <div style={{ overflowWrap: 'break-word' }} className={`${p.isSender ? "bg-[#3c78bd]" : "bg-[#a9b2b8]"} max-w-[800px] min-w-16 relative p-3 pr-6 rounded-lg `}>
                    {p.content}

                    {p.status &&
                        <img className="w-5 absolute bottom-0 right-1" src={`/asset/chatroom/message/${p.status}.png`} />
                    }
                </div>
                <p className={` text-[12px] flex ${p.isSender ? "ml-1 justify-end" : "mr-1 justify-start"}`}>
                    {p.dateTime}
                </p>
            </div>
        </div>


    )
}
