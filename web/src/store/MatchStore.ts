import { makeAutoObservable, reaction } from "mobx";
import agent from "../Api/agent";
import { ChatroomDto, Message } from "../Model/Chatroom";
import SummaryStore from './SummaryStore';
import { store } from "./Store";
import { UserConnection } from "../Model/UserConnection";
import { GroupedMessage } from './../Model/Chatroom';
import { AiGenForm } from "../Model/AiGen";


export default class MatchStore {
    Chatrooms: ChatroomDto[] = []
    roomIdx: number = -1
    tempIdSet: Set<number> = new Set();


    isAnswerOpen:boolean=false;
    answer:string|undefined = undefined


    inputValue:string =""
    isObservationDisable :boolean = false
   
    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.roomIdx,
            roomIdx => {
                if (roomIdx >= 0 && !this.isObservationDisable) {
                    this.ReadMessages_whenEnterChatroom();
                   
                }
                else{
                   this.isObservationDisable = false
                }
             
            }
        )
    }
    sortChatrooms = ()=>{
         var sortedChatroom =  this.Chatrooms.slice().sort((a, b) => new Date(b.lastMessage_Timestamp).getTime() - new Date(a.lastMessage_Timestamp).getTime());
        this.setChatrooms(sortedChatroom)
    }
    setChatrooms = (chatrm:ChatroomDto[])=>{


        this.Chatrooms = chatrm
    }
    setInputValue=(s:string)=>{
        this.inputValue = s
    }
    setAnswerOpenClose =(b:boolean)=>{
        if(!b){
            this.answer = undefined
        }
        this.isAnswerOpen = b;
    }
    setAnswer=(ans?:string)=>{
        this.answer =ans
    }
    //simple function
    findMessage = (id: number) => {
        if (this.Chatrooms[this.roomIdx] == undefined) {
            return
        }
        for (let groupedMessage of this.Chatrooms[this.roomIdx].groupedMessages) {


            var msg = groupedMessage.messages.find(x => x.id === id)
            if (msg) {
                return msg
            }
        }
        return undefined
    }


    generateTempId() {
        let negativeRandomNumber;
        do {
            negativeRandomNumber = Math.floor(Math.random() * -100);
        } while (this.tempIdSet.has(negativeRandomNumber));


        this.tempIdSet.add(negativeRandomNumber);


        return negativeRandomNumber;
    }


    getUnreadMsgId = () => {
        if (this.Chatrooms[this.roomIdx] == undefined) {
            return;
        }
        var msgIdList: number[] = []
        for (let groupedMessage of this.Chatrooms[this.roomIdx].groupedMessages) {
            var msgIds = groupedMessage.messages.filter(x => x.read_TimeStamp === undefined || x.read_TimeStamp === null).map(x => x.id);
            msgIdList.push(...msgIds)
        }
        return msgIdList


    }
    pushReceiveClientMessage = (msg: Message) => { // purpose: check the date of the message, push to the latest group or create a new group
        
        var senderChatroom = this.Chatrooms.find(x=>x.receiverId == msg.senderId)
        if(senderChatroom ==undefined ) return 
        //new add
        //console.log(senderChatroom, this.Chatrooms[this.roomIdx])

        
        if(this.Chatrooms[this.roomIdx]!=undefined){
            console.log("in ")
            var isLatestSender_Greater_current = senderChatroom.lastMessage_Timestamp > this.Chatrooms[this.roomIdx].lastMessage_Timestamp
            this.isObservationDisable = true
            if (this.Chatrooms[this.roomIdx].roomId !== msg.roomId) {
                //not in the chatroom
                console.log(senderChatroom.lastMessage_Timestamp,">", this.Chatrooms[this.roomIdx].lastMessage_Timestamp)
                console.log(!isLatestSender_Greater_current)
                if(!isLatestSender_Greater_current){
                    this.roomIdx +=1
                }
            }
            else{
                // in the chatroom already
                this.roomIdx = 0
            }
        }
        senderChatroom.lastMessage_Timestamp = msg.send_TimeStamp;
        this.sortChatrooms()
     //  
        var latestGroupMsg = senderChatroom.groupedMessages[senderChatroom.groupedMessages.length - 1]


        var latestDate = latestGroupMsg === undefined ? new Date(1970, 1, 1) : new Date(latestGroupMsg.date) //so, the following cmp will be false
        var msgSendDate = new Date(msg.send_TimeStamp)


        latestDate = new Date(latestDate.getFullYear(), latestDate.getMonth(), latestDate.getDate());
        msgSendDate = new Date(msgSendDate.getFullYear(), msgSendDate.getMonth(), msgSendDate.getDate())


        console.log(msgSendDate.getTime(), latestDate.getTime())


        if (msgSendDate.getTime() === latestDate.getTime()) { //if same date


            latestGroupMsg.messages.push(msg) //add to this group msg


        }
        else { // if not, create a new date
            const year = msgSendDate.getFullYear();
            const month = (msgSendDate.getMonth() + 1).toString().padStart(2, '0');
            const day = msgSendDate.getDate().toString().padStart(2, '0');
            const dateString = `${year}-${month}-${day}T00:00:00`;
            console.log(msgSendDate)
            console.log(dateString)


            var newGrpMsg: GroupedMessage = {
                date: dateString,
                messages: [msg]
            }

            senderChatroom.groupedMessages.push(newGrpMsg)
        }


    }

    pushSendClientMessage = (msg: Message) => { // purpose: check the date of the message, push to the latest group or create a new group
        
         
        var latestGroupMsg = this.Chatrooms[this.roomIdx].groupedMessages[this.Chatrooms[this.roomIdx].groupedMessages.length - 1]


        var latestDate = latestGroupMsg === undefined ? new Date(1970, 1, 1) : new Date(latestGroupMsg.date) //so, the following cmp will be false
        var msgSendDate = new Date(msg.send_TimeStamp)


        latestDate = new Date(latestDate.getFullYear(), latestDate.getMonth(), latestDate.getDate());
        msgSendDate = new Date(msgSendDate.getFullYear(), msgSendDate.getMonth(), msgSendDate.getDate())


        console.log(msgSendDate.getTime(), latestDate.getTime())


        if (msgSendDate.getTime() === latestDate.getTime()) { //if same date


            latestGroupMsg.messages.push(msg) //add to this group msg


        }
        else { // if not, create a new date
            const year = msgSendDate.getFullYear();
            const month = (msgSendDate.getMonth() + 1).toString().padStart(2, '0');
            const day = msgSendDate.getDate().toString().padStart(2, '0');
            const dateString = `${year}-${month}-${day}T00:00:00`;
            console.log(msgSendDate)
            console.log(dateString)


            var newGrpMsg: GroupedMessage = {
                date: dateString,
                messages: [msg]
            }


            this.Chatrooms[this.roomIdx].groupedMessages.push(newGrpMsg)
        }


    }


    //handle variable
    ReadMessages_whenEnterChatroom = async () => {
        console.log("in")


        if (this.Chatrooms[this.roomIdx] == undefined || store.accountStore.User == undefined) {
            return;
        }
        else {
            console.log("in 2")


            var hkt = store.summaryStore.getHKTime();


            var conn = { userId: store.accountStore.User.id, roomId: this.Chatrooms[this.roomIdx].roomId } as UserConnection


            var msgId = this.getUnreadMsgId();
            console.log(msgId)
            if (msgId == undefined || msgId.length <= 0) {
                return
            }


            await store.connectionStore.readMessage(msgId, conn, hkt)
        }
    }

    

    ReadMessages_whenReceive = async (roomId: string, msgId: number) => {
        console.log("in")


        if (this.Chatrooms[this.roomIdx] == undefined || store.accountStore.User == undefined) {
            return;
        }
        else {
            if (this.Chatrooms[this.roomIdx].roomId !== roomId) {
                return;
            }
            console.log("in 2")


            var hkt = store.summaryStore.getHKTime();


            var conn = { userId: store.accountStore.User.id, roomId: this.Chatrooms[this.roomIdx].roomId } as UserConnection






            await store.connectionStore.readMessage(msgId, conn, hkt)
            store.summaryStore.scrollToBottom("chatroom")


        }
    }


    GetChatRoomDetails = async () => {


        try {
            const result = await agent.Match.GetChatRoomDetails();
           
            this.Chatrooms = result.data;
            console.log(result.data)
            return


        }
        catch (ex) {
            throw ex;
        }
    }


    setRoomIdx = (idx: number) => {
        this.roomIdx = idx;
    }




    Send_ClientMsg = async (senderId: string, receiverId: string, roomId: string, content: string) => {
       
        if (this.Chatrooms[this.roomIdx] == undefined) {
            return;
        }
        else {
            const key = this.generateTempId()
            const hkt = store.summaryStore.getHKTime();
            const msg = { id: key, senderId: senderId, receiverId: receiverId, roomId: roomId, content: content, send_TimeStamp: hkt.toString() } as Message
            this.pushSendClientMessage(msg)
           
            this.Chatrooms[this.roomIdx].lastMessage_Timestamp = hkt.toString()
            this.sortChatrooms();
            this.isObservationDisable = true
            this.roomIdx = 0;
            store.connectionStore.sendMessage(key, roomId, content, receiverId)


            return;


        }


    }


    Receive_ClientMsg = async (msgId: number, senderId: string, receiverId: string, roomId: string, content: string) => {
        var result = this.Chatrooms.find(x => x.roomId == roomId)
        if (result === undefined) {
            return;
        }
        const hkt = store.summaryStore.getHKTime();


        let isRead; /// handle if the msg is read
        if (this.Chatrooms[this.roomIdx] == undefined) {
            isRead = false
        }
        else {
            isRead = roomId === this.Chatrooms[this.roomIdx].roomId
        }


        // assign
        const msg = { id: msgId, senderId: senderId, receiverId: receiverId, roomId: roomId, content: content, send_TimeStamp: hkt.toString(), read_TimeStamp: undefined } as Message
        this.pushReceiveClientMessage(msg)
    }


    handleMsgReadByReceiver_200Ok = async (messageId: number[] | number, datetime: string) => {
        if (this.Chatrooms[this.roomIdx] == undefined) {
            return
        }
        if (Array.isArray(messageId)) {
            messageId.forEach((msgId) => {
                var msg = this.findMessage(msgId)
                if (msg) {
                    console.log(msg)
                    msg.read_TimeStamp = datetime;
                }
            })
        }
        else {
            var msg = this.findMessage(messageId)
            if (msg) {
                console.log(msg)
                msg.read_TimeStamp = datetime;
            }
        }
        console.log(`Read at ${datetime} `)
    }






    handleSendMsg_200Ok = (msgId: number, key: number,) => { // update msg real Id
        if (this.Chatrooms[this.roomIdx] == undefined) {
            return
        }


        var msg = this.findMessage(key)
        if (msg) {
            msg.id = msgId;
        }
    }


    genAiResponse = async(form: AiGenForm) => {
        try {
            const result = await agent.Match.genAiResponse(form);
            console.log(result.data)
            return result.data
        }
        catch (error) {
            throw error
        }
    }




}

