import React from 'react'
import AccountBoard from '../AccountBoard/AccountBoard'
import { store } from '../../../store/Store'
import { observer } from 'mobx-react-lite'
import MenuContainer from './PoppedUpMenu/MenuContainer'

export default observer(function UpperNavBar() {

    return (
      
            <div className={`${store.commonStore.showNavBar ? "pl-[115px]":"pl-[15px]"} pr-[15px] z-10 fixed top-0 left-0 flex justify-between  items-center  w-full  h-[40px] bg-[#FFFFFF]`} >
                <img onClick={store.commonStore.setNavBar} src="/asset/button/menu/menu.png" className="h-6 w-5 cursor-pointer"/>
                <AccountBoard />
            </div>
       

    )
})
