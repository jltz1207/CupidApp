import React from 'react'
import ProfileImage from '../../../AccountBoard/Profile/ProfileImage'
import ProfileName from '../../../AccountBoard/Profile/ProfileName'
import { store } from '../../../../../store/Store'
import { observer } from 'mobx-react-lite'

interface prop {
    handleClick: () => void
    selected: boolean
}
export default observer(function AccountItem(p: prop) {
    return (
        <div className=" flex gap-2 py-1 px-3 items-center justify-between  cursor-pointer hover:bg-[#E9E7E7]" onClick={p.handleClick}>
            <div className="flex items-center gap-2">
                <ProfileImage  />
                <div>
                    <p className="text-[10px]  ">{store.accountStore.User?.name}</p>
                    <p className="text-[10px]  ">{store.accountStore.User?.email}</p>
                </div>
            </div>
            <img src="/asset/button/menu/menuArrow.png" className="w-4" />
        </div>
    )
})
