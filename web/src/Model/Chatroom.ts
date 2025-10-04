import { UserDto_Detailed } from "./Discover"

export interface ChatroomDto{
    roomId:string
    receiverId:string
    profile: UserDto_Detailed
    groupedMessages: GroupedMessage[]
    lastMessage_Timestamp:string
}

export interface Message{
    id:number
    senderId:string
    receiverId:string
    roomId:string
    content:string

    send_TimeStamp:string //dateTime
    read_TimeStamp?:string //dateTime
}

export interface GroupedMessage{
    date:string
    messages: Message[]

}