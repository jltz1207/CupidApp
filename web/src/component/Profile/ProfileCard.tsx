import { observer } from 'mobx-react-lite'
import React from 'react'
import { store } from '../../store/Store'

export default observer(function ProfileCard() {


    const { Current_OtherUsers, UserIdx } = store.discoverStore;
    const profileText = ( Current_OtherUsers!= null && Current_OtherUsers[UserIdx] != null ) ? Current_OtherUsers[UserIdx].name + ", " + Current_OtherUsers[UserIdx].age
        : "XXX, XX"

    const profileImg =(Current_OtherUsers!= null && Current_OtherUsers[UserIdx] != null )? Current_OtherUsers[UserIdx].profileFiles[0] : '/asset/profile/blankProfile.png'

    return (
        <div className=" w-[800px] h-[850px]  rounded-[20px]   drop-shadow-2xl border-2 border-[#c7c6c3]">
            <img src={profileImg} className="w-full h-[800px]  rounded-t-[20px]" />

            <div className=" p-3 ">
                <span>{profileText}</span>
            </div>
        </div>
    )
})
