import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { store } from '../../store/Store'
import ImageScroller, { ImageProp } from '../../component/Profile/ImageScroller'


interface Prop{
  showProfile:boolean
  setShowProfile:(b:boolean)=>void
}

export default observer(function MatchProfile(p:Prop) {
  const { Chatrooms, roomIdx, Send_ClientMsg } = store.matchStore
  //undefined or profile
  const chatroomProfile = Chatrooms[roomIdx] ? Chatrooms[roomIdx].profile : undefined

  const images: ImageProp[] | undefined = (chatroomProfile != undefined) ?
    chatroomProfile.profileFiles.map((item, idx) => {
      return ({ src: item, isOpen: false })
    })
    : undefined

  if (chatroomProfile == undefined || p.showProfile == false)
    return null
  return (
    <div className=" profileSection bg-[#FFFFFF] h-full">
      <div className="flex justify-end pr-3 pt-3">
        <img src="/asset/button/general/cross.png" className="w-6 cursor-pointer" onClick={()=>{p.setShowProfile(false)}} />

      </div>

      <div className=' h-full flex flex-col items-center  px-8'>
        <div className="flex flex-col w-full items-center gap-4  border-b-2 border-[#B2B8B4] py-8">
          <img className="w-36 rounded-full" src={chatroomProfile != undefined ? chatroomProfile.profileFiles[0] : ""}></img>
          <span className='text-[20px]'>
            {chatroomProfile != undefined ? chatroomProfile.name + ", " + chatroomProfile.age : ""}
          </span>
          <div style={{ overflowWrap: 'break-word' }} >
            {chatroomProfile != undefined ? chatroomProfile.bio != undefined ? chatroomProfile.bio : "{NO BIO BEING SHOWN}" : "{BIO UNDEFINED}"}

          </div>

        </div>
        <div className="py-8">
          <ImageScroller title="Profile picture" imageList={images} />
        </div>

      </div>
    </div>


  )
})

