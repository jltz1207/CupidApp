import React, { useEffect } from 'react'
import MessageBox from '../../component/chat/MessageBox'
import { store } from '../../store/Store'
import { observer } from 'mobx-react-lite';

export default observer(function GptMessageContainer() {

    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // This ensures you get the AM/PM part
    };
    const {loadAsistMessages, CupidMessages, AsistMessages, loadCupidMessages, Chatroom } = store.gptStore;

    useEffect(() => {
        loadCupidMessages()
        loadAsistMessages()
    }, [])

    const result = Chatroom === 'Cupid' ? CupidMessages.map((item, idx) => {
        return (
            <div onClick={() => { console.log(item) }}>
                <MessageBox isSender={item.gptRoleId == 3} content={item.content} dateTime={new Date(item.send_TimeStamp).toLocaleTimeString('en-US', options)} />
            </div>
        )
    })
        : AsistMessages.map((item, idx) => {
            return (
                <div onClick={() => { console.log(item) }}>
                    <MessageBox isSender={item.gptRoleId == 3} content={item.content} dateTime={new Date(item.send_TimeStamp).toLocaleTimeString('en-US', options)} />
                </div>
            )
        })

    return (
        <div className="flex flex-col gap-4 flex-grow py-12">
            {result}
        </div>
    )
})
