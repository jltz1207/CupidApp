import React, { FormEvent, ReactNode, useEffect, useState } from 'react'
import InputBar from '../../component/chat/InputBar'
import { store } from '../../store/Store'
import { observer } from 'mobx-react-lite'
import MessageBox from '../../component/chat/MessageBox'
import { Message } from '../../Model/Chatroom'
import DailyMessageContainer from '../../component/chat/Container/DailyMessageContainer'
import AiGenInfo from '../../component/commonInfo/AiGenInfo/AiGenInfo'

export interface BtnProp {
  ButtonDiv: () => JSX.Element

}

export default observer(function MatchChatRoom() {
  const [isAiOpen, setAiOpen] = useState<boolean>(false);
  const { sendMessage } = store.connectionStore
  const { Chatrooms, roomIdx, Send_ClientMsg,inputValue,setInputValue } = store.matchStore
  const { User } = store.accountStore
  const { scrollToBottom } = store.summaryStore


  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true // This ensures you get the AM/PM part
  };

  useEffect(() => {
    scrollToBottom("chatroom");
  })

  const onSubmit = (event: React.FormEvent<HTMLFormElement>, value: string) => {
    event.preventDefault()
    if (Chatrooms[roomIdx] != null && User != null && inputValue != "") {
      const rId = Chatrooms[roomIdx].roomId
      const receiverId = Chatrooms[roomIdx].receiverId
      const senderId = User.id

      console.log(senderId, receiverId, rId, inputValue)
      Send_ClientMsg(senderId, receiverId, rId, inputValue)
      setInputValue("")
      scrollToBottom("chatroom")
    }
  }

  const btnList: BtnProp[] = [
    
    {
      ButtonDiv: () => (
        <div className={`relative rounded-md  h-10 w-10 p-1  ${isAiOpen?'bg-[#E9E7E7]':'' }`}>
          <AiGenInfo isOpen={isAiOpen} setOpen={setAiOpen} />
          <img className="w-full h-full" src={"/asset/chatroom/function/ai.png"} onClick={() => { setAiOpen(!isAiOpen) }} />
        </div>
      )
    }
  ]

  const calStatus = (item: Message) => {
    if (item.senderId !== User?.id) {
      return undefined
    }

    if (item.read_TimeStamp != null) {
      return 'read'
    }
    else if (item.send_TimeStamp != null) {
      return 'sent'
    }
    else {
      return undefined
    }

  }



  return (
    <div id='chatroom' className='chatRoom bg-[#e6eaf0]  flex flex-col justify-between '>

      <div className="px-8 pt-8 pb-24 flex flex-col gap-4 flex-grow">
        {Chatrooms[roomIdx] != undefined && Chatrooms[roomIdx].groupedMessages.map((grpMsg, idx) => {
          return (
            <DailyMessageContainer groupedMessage={grpMsg} />
          )
        })
        }

      </div>
      <InputBar inputValue={inputValue} setInputValue={setInputValue} btnList={btnList} onSubmit={onSubmit} />

    </div>

  )
})
