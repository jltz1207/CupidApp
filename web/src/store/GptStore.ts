import { makeAutoObservable } from "mobx";
import { GptMessage } from "../Model/Gpt";
import agent from "../Api/agent";
import { store } from "./Store";
import { ProfileModel } from "../Model/User";
import { AccountForm } from "../Model/Account";

export default class GptStore {
    CupidMessages: GptMessage[] = []
    AsistMessages: GptMessage[] = []
    Chatroom:'Asist' | 'Cupid' = 'Cupid'

    constructor() {
        makeAutoObservable(this);
    }

    loadCupidMessages = async () => {
        try {
            const result = await agent.Gpt.loadCupidMessages();
            this.CupidMessages = result.data;
            return;
        }
        catch (error) {
            throw error
        }
    }

    sendCupidMessage = async (query:string) => {
        try {
            console.log(query)
            this.handleClientSendMsg(query)
            const result = await agent.Gpt.sendCupidMessage(query);
            this.CupidMessages.push(result.data)
            return;
        }
        catch (error) {
            throw error
        }
    }
    loadAsistMessages = async () => {
        try {
            const result = await agent.Gpt.loadAsistMessages();
            this.AsistMessages = result.data;
            return;
        }
        catch (error) {
            throw error
        }
    }
    sendAsistMessage = async (query:string) => {
        try {
            console.log(query)
            this.handleClientSendMsg(query)
            const result = await agent.Gpt.sendAsistMessage(query);
            this.AsistMessages.push(result.data)
            return;
        }
        catch (error) {
            throw error
        }
    }
    handleClientSendMsg =(query:string)=>{
        if(store.accountStore.User == undefined){
            return
        }
        const newMsg = {id:0,userId:store.accountStore.User.id, content:query, send_TimeStamp: store.summaryStore.getHKTime().toString(), gptRoleId:3, categoryId:0} as GptMessage
       this.Chatroom === "Cupid" ? this.CupidMessages.push(newMsg) : this.AsistMessages.push(newMsg)
    }
    changeChatroom = (room:'Cupid'| 'Asist')=>{
        this.Chatroom = room
    }

    GenUpdateBio = async (bioForm:any) =>{
        try{
            var result = await agent.Gpt.GenUpdateBio(bioForm);
            return result.data
        }
        catch(error){
            console.log(error)
        }
    }

    GenerateAiBio = async (basemodel:ProfileModel) =>{
        try{
            var model = {...basemodel, id:store.accountStore.User?.id??''}
            console.log(model)
            const formData = new FormData();

            for (const key in model) {
                const data = (model as Record<string, any>)[key]

                if (Array.isArray(data) && data[0] instanceof File) {

                    data.forEach((item, idx) => {
                        formData.append(key, item)
                    })

                }
                else if (Array.isArray(data) && data[0] instanceof Number) {
                    formData.append(key, JSON.stringify(data))
                }
                else {
                    formData.append(key, data)
                }

            }


            console.log(formData)
            var result = await agent.Gpt.GenerateAiBio(formData);
            return result.data
        }
        catch(error){
            throw(error)
        }
    }
}