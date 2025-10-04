import React from 'react'
import AccountItem from './Items/AccountItem'
import MenuItem from './Items/MenuItem'
import { store } from '../../../../store/Store'
import { useNavigate } from 'react-router-dom';

interface prop {
    isOpen: boolean
}

export default function MenuContainer(p: prop) {
    const { Logout } = store.accountStore
    const{setPageId} = store.summaryStore
    const options =
        [{ src: "/asset/button/menu/icon/setting.png", title: "Setting", handleClick: () => { } },
        { src: "/asset/button/menu/icon/logout.png", title: "Logout", handleClick: () => { Logout() } }]

    const navigate = useNavigate()

    if (!p.isOpen)
        return null
    return (
        <div className="fixed top-10 right-2 w-[300px] rounded-lg bg-[#FFFFFF] shadow-xl">
            <AccountItem handleClick={() =>{ navigate("/account");setPageId(3)}} selected={false} />
            {options.map((item, idx) => (
                <MenuItem src={item.src} title={item.title} handleClick={item.handleClick} selected={false} />
            ))}

        </div>
    )
}
