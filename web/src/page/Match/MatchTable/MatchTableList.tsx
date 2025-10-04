import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { store } from '../../../store/Store';
import MatchTableElement from './MatchTableElement';

interface Prop{
  setShowProfile:(b:boolean)=>void

}
export default observer(function MatchTableList(p:Prop) {
  const { Chatrooms, roomIdx,setRoomIdx  } = store.matchStore;
  
  const scrollToBottom = () => {
    var element = document.getElementById('chatroom');
    if (element === null) { return; }
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
  }

 // const sortedChatrooms = Chatrooms.slice().sort((a, b) => new Date(b.lastMessage_Timestamp).getTime() - new Date(a.lastMessage_Timestamp).getTime());

  return (
    <div className='detailsList  '>
      {Chatrooms.map((item, i) => (
        <div onClick={()=>{
          p.setShowProfile(true)
          setRoomIdx(i)
          scrollToBottom()
        }}>
          <MatchTableElement chatroom={item} key={i} selected={roomIdx === i} />
        </div>

      ))}
    </div>
  )
})
