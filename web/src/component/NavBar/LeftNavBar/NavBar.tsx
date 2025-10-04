import React, { useState } from 'react'
import AccountBoard from '../AccountBoard/AccountBoard'
import { store } from '../../../store/Store'
import { observer } from 'mobx-react-lite'
import NavElement from './NavElement'

export default observer(function NavBar() {
    //const [selectedIdx, setSelectedIdx] = useState(0);
    const {PageId, setPageId} =store.summaryStore
    const navElements: NavElementProp[] = [
        { src: "discover", link: "/discover" },
        { src: "chat", link: "/match" },
        { src: "robot", link: "/gpt" },
        { src: "account", link: "/account" },
        { src: "face", link: "/face" },
    ]
    return (
        <div className="fixed flex flex-col gap-4 items-center bg-nav-blue w-[100px] h-screen z-20 ">
            {navElements.map((element, idx) => (
                <NavElement key={idx} idx={idx} setSelectedIdx={setPageId} src={element.src} link={element.link} selected={PageId === idx} />
            ))}
        </div>
    )
})

export interface NavElementProp {
    src: string
    link: string
}