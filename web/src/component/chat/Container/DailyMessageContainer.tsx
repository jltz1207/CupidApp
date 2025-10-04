import React from 'react'
import { GroupedMessage, Message } from '../../../Model/Chatroom'
import MessageBox from '../MessageBox'
import { store } from '../../../store/Store'
import { observer } from 'mobx-react-lite'
import DateSplit from '../DateSplit/DateSplit'
interface Prop {
    groupedMessage: GroupedMessage
}
export default observer(function DailyMessageContainer({ groupedMessage }: Prop) {
    const { User } = store.accountStore

    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // This ensures you get the AM/PM part
    };

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

    const result = groupedMessage.messages.map((item, idx) => {
        return (
            <div onClick={() => { console.log(item) }}>
                <MessageBox status={calStatus(item)} isSender={item.senderId === User?.id} content={item.content} dateTime={new Date(item.send_TimeStamp).toLocaleTimeString('en-US', options)} />
            </div>
        )
    })
    return (

        <div className="flex flex-col gap-4">
                <DateSplit date={groupedMessage.date} />
            {result}
        </div>
    )
})
