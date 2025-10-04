import React from 'react'
import ProfileImage from '../../../component/NavBar/AccountBoard/Profile/ProfileImage'
import { ChatroomDto } from '../../../Model/Chatroom'
import { observer } from 'mobx-react-lite'
import { store } from '../../../store/Store'


interface Prop {
    chatroom: ChatroomDto
    selected: boolean
}

export default observer(function MatchTableElement({ chatroom, selected }: Prop) {
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // This ensures you get the AM/PM part
    };

    const latestTime = () => {
        if (chatroom === undefined || chatroom.groupedMessages[chatroom.groupedMessages.length - 1] === undefined) {
            return
        }

        var latestMsg = chatroom.groupedMessages[chatroom.groupedMessages.length - 1].messages[chatroom.groupedMessages[chatroom.groupedMessages.length - 1].messages.length - 1]
        return (latestMsg != undefined ?
            new Date(latestMsg.send_TimeStamp).toLocaleTimeString('en-US', options) :
            "")
    }

    const previewMsg = () => {
        if (chatroom === undefined || chatroom.groupedMessages[chatroom.groupedMessages.length - 1] === undefined) {
            return
        }

        var latestMsg = chatroom.groupedMessages[chatroom.groupedMessages.length - 1].messages[chatroom.groupedMessages[chatroom.groupedMessages.length - 1].messages.length - 1]
        return (
            latestMsg != undefined ? (latestMsg.senderId === store.accountStore.User?.id) ?
                "You: " + latestMsg.content :
                latestMsg.content :
                "(start message!)"
        )
    }

    return (
        <div className={`h-[120px]   p-2 cursor-pointer flex flex-col justify-center `}>
            <div className={` ${selected ? "bg-[#e9e7e7]" : ""}  flex flex-col justify-center gap-2 p-3 rounded-lg`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center  gap-2">
                        <ProfileImage imgSrc={chatroom.profile.profileFiles[0]} />
                        <p className="font-bold text-[18px]">{chatroom.profile.name}</p>
                    </div>
                    <span>
                        {latestTime()}
                    </span>
                </div>
                <p className="overflow-hidden">
                    {previewMsg()}
                </p>
            </div>

        </div>
    )
})
