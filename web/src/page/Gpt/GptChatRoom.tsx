import React, { useEffect, useState } from 'react'
import InputBar from '../../component/chat/InputBar'
import GptMessageContainer from './GptMessageContainer'
import GptStore from './../../store/GptStore';
import { store } from '../../store/Store';
import { observer } from 'mobx-react-lite';

export default observer(function GptChatRoom() {
    const {Chatroom,sendAsistMessage} = store.gptStore;
    const { scrollToBottom, sleep, setRateOpen } = store.summaryStore

    useEffect(() => {
        scrollToBottom("gptChatroom");
    }, [Chatroom])
    const [inputValue, setInputValue] = useState<string>("")
    const { sendCupidMessage } = store.gptStore;

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>, value: string) => {
        event.preventDefault()
        Chatroom === 'Cupid' ?await sendCupidMessage(inputValue): await sendAsistMessage(inputValue)
        setInputValue("")
        scrollToBottom("gptChatroom")
        
        await sleep(5000)
        setRateOpen(Chatroom === 'Cupid' ?4:3)
       
        
    }


    return (
        <div id="gptChatroom" className="chatRoom flex flex-col justify-between bg-[#e6eaf0] px-20 pt-5">
            <GptMessageContainer />
            <InputBar inputValue={inputValue} setInputValue={setInputValue} onSubmit={onSubmit} />

        </div>
    )

})