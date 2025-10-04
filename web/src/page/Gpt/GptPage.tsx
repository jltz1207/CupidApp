import React from 'react'
import GptChatRoom from './GptChatRoom'
import GptModelList from './GptModelList'

export default function GptPage() {
  return (
    <div className="flex gpt-chat-parent bg-[#e6eaf0]">
       <GptModelList />
        <GptChatRoom />
    </div>
  )
}
