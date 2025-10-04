import React, { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import { Outlet, useLocation } from 'react-router-dom';
import RegisterInfo from './Info/RegisterInfo';
import { useStore } from '../../store/Store';
import { observer } from 'mobx-react-lite';

export default observer(function LoginPage() {
  const store = useStore()
  const { accountStore } = store

  // useEffect(()=>{
  //   accountStore.Logout();
  // },[])

  const location = useLocation();
  // const [isOpen, setOpen] = useState<boolean>(true)
  return (
    <div className={`flex flex-grow h-screen   `}>
      <RegisterInfo />

      <div className={` ${accountStore.isRegInfoOpen ? "blur-overlay" : ""} `}></div>

      <div className="w-full  bg-[#344B75] ">

      </div>
      <div className="min-[400px]:w-[500px] bg-white px-8">

        {location.pathname === "/" && <LoginForm />}
        {location.pathname !== "/" && <Outlet />}

      </div>
    </div>
  )
})
