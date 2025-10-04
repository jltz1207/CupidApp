import React from 'react'
interface prop {
    src: string
    title: string
    handleClick: () => void
    selected: boolean
}
export default function MenuItem(p: prop) {
    return (
        <div className=" flex justify-between gap-2 py-1 px-3 items-center cursor-pointer hover:bg-[#E9E7E7]" onClick={p.handleClick}>
            <div className="flex items-center gap-1">
                <img src={p.src} className="w-5" />
                <p className="text-[12px]">{p.title}</p>
            </div>

            <img src="/asset/button/menu/menuArrow.png" className="w-4" />

        </div>
    )
}
