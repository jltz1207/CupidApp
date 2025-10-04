import React, { useState } from 'react'
import CountDown from '../../component/countDown/Timer'
import RegisterHeading from '../../component/FormElement/Login/Register/RegisterHeading'
import SingleImageUpload from '../../component/FormElement/Image/SingleImageUpload'
import FaceForm from './Sub/FaceForm'
import FaceResult from './Sub/FaceResult'
import { UserDto_Detailed } from '../../Model/Discover'
import { store } from '../../store/Store'
import LoadingComponent from '../../component/Loading/LoadingComponent'
import { observer } from 'mobx-react-lite'

export default observer(function FacePage() {
  //const [allowed, setAllowed] = useState<boolean>(false)
 const {IsLoading} = store.discoverStore;
  

  const [errorMsg, setErorrMsg] = useState<string|undefined>()
   const [resultUser, setResultUser] = useState<UserDto_Detailed | undefined>()

   return (
    <div className={`page-parent  flex py-6`}>
      {IsLoading && <LoadingComponent content="Loading..." /> }
      <FaceForm setErorrMsg={setErorrMsg} setResultUser={setResultUser}  />
      <FaceResult  errorMsg={errorMsg} resultUser={resultUser} setResultUser={setResultUser}/>

    </div>
  )
})
