import React from 'react'
import { store } from '../../store/Store';
import ProfileImage from '../../component/NavBar/AccountBoard/Profile/ProfileImage';
import { observer } from 'mobx-react-lite';

interface PreviewProp {
  selected: boolean
  name: string
  lastMessage: string
  src: string
  onClick:()=>void
}
const GptModelPreview = (p: PreviewProp) => {
  return (
    <div className={`h-[120px]   p-2 cursor-pointer flex flex-col justify-center `} onClick={p.onClick}>
      <div className={` ${p.selected ? "bg-[#e9e7e7]" : ""}  flex flex-col justify-center gap-2 p-3 rounded-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center  gap-2">
            <ProfileImage imgSrc={p.src} />
            <p className="font-bold text-[18px]">{p.name}</p>
          </div>
          <span>
            {/* {latestTime()} */}
          </span>
        </div>
        <p className="overflow-hidden">
          {p.lastMessage}
        </p>
      </div>

    </div>)
}

export default observer(function GptModelList() {
  const { changeChatroom, Chatroom, CupidMessages, AsistMessages } = store.gptStore;
  const models = [{ name: "Cupid", lastMessage: CupidMessages.length > 1 && CupidMessages[CupidMessages.length - 1] ? CupidMessages[CupidMessages.length - 1].content : "(start conversation)", src: "/asset/chatroom/icon/cupidIcon.png", onClick: ()=>{changeChatroom('Cupid')} },
  { name: "Asist", lastMessage: AsistMessages.length > 1 && AsistMessages[AsistMessages.length - 1] ? AsistMessages[AsistMessages.length - 1].content : "(start conversation)", src:"/asset/chatroom/icon/asistIcon.png", onClick: ()=>{changeChatroom('Asist')} },
  ]
  return (
    <div className="detailsList">
      {models.map((item, idx) => {
        return <GptModelPreview
          onClick={item.onClick}
          selected={Chatroom === item.name}
          name={item.name}
          lastMessage={item.lastMessage}
          src={item.src} />
      })}
    </div>
  )
})

