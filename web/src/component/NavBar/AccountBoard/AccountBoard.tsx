import React, { useState } from 'react'
import ProfileImage from './Profile/ProfileImage'
import ProfileName from './Profile/ProfileName'
import { useStore } from '../../../store/Store';
import MenuContainer from '../UpperNavBar/PoppedUpMenu/MenuContainer';

export default function AccountBoard() {
    const store = useStore();
    const { accountStore } = store;
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false)
    return (


        <div className="" >
            <div className="flex gap-2 py-1 px-2 items-center" onClick={() => { setMenuOpen(!isMenuOpen) }}>
                <ProfileImage />
                <img className="w-[15px]" src={"asset/button/menu/downArrow.png"} />
            </div>

            {/* <ProfileName /> */}
            <MenuContainer isOpen={isMenuOpen} />

        </div>

    )
}
