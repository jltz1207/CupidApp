import { makeAutoObservable, reaction } from "mobx";
import { BrowserRouter, useNavigation } from "react-router-dom";
import agent from "../Api/agent";
import { error } from 'console';
import { Id_Name } from "../Model/Id_Name";
import { UserDto_Detailed } from "../Model/Discover";
import { UserConnection } from './../Model/UserConnection';
import { store } from "./Store";
import * as signalR from "@microsoft/signalr";

export default class DiscoverStore {
    Current_OtherUsers: UserDto_Detailed[] | null = null
    UserIdx: number = 0
    IsLoading: boolean = false
    IsOpenMatchedInfo = false

    constructor() {
        makeAutoObservable(this);
    }

    getCurrentUserId = () => {
        if (this.Current_OtherUsers == null || this.Current_OtherUsers[this.UserIdx] == null)
            return ''
        console.log(this.Current_OtherUsers[this.UserIdx].id)

        return this.Current_OtherUsers[this.UserIdx].id

    }
    getRandomMatches = async () => {
        try {
            this.IsLoading = true
            const result = (await agent.Discover.getRandomMatches()).data;
            this.Current_OtherUsers = result

            console.log(result)
            this.IsLoading = false

            return result
        }
        catch (ex) {
            this.IsLoading = false
            throw ex;
        }
    }
    setOpenMatchedInfo = (b: boolean) => {
        this.IsOpenMatchedInfo = b
    }
    handleDislike = () => {
        if (this.UserIdx + 1 === this.Current_OtherUsers?.length) {
            this.UserIdx = 0
            return;
        }
        this.UserIdx++
        console.log(this.UserIdx)
    }

    handleLike = async () => {
        if (this.Current_OtherUsers == null || (this.Current_OtherUsers != null && this.Current_OtherUsers[this.UserIdx] == null)) {
            return;
        }

        try {
            console.log("Like!")
            var likedName = this.Current_OtherUsers[this.UserIdx].name
            const response = await agent.Discover.handleLike(this.Current_OtherUsers[this.UserIdx].id);
            if (this.UserIdx + 1 === this.Current_OtherUsers?.length) {
                this.UserIdx = 0
            }
            else{
                this.UserIdx++
            }
            if (response.data.isMatch && response.data.roomId != undefined && response.data.roomId != null) {
                // Start the SignalR connection
                store.connectionStore.initSignalRConnection()
                store.connectionStore.joinChatRoom(response.data.roomId)

            }
            var desiredChatRoom = store.matchStore.Chatrooms.find(x => x.roomId == response.data.roomId)

            var result: any = {
                isMatched: response.data.isMatch,
                chatRoom: desiredChatRoom,
                likedName : likedName
            }
            return result
        }
        catch (error) {
            throw error;
        }

    }

    handleFaceLike = async (likedId: string) => {


        try {
            console.log("Like!")
            const response = await agent.Discover.handleLike(likedId);
            if (response.data.isMatch && response.data.roomId != undefined && response.data.roomId != null) {
                // Start the SignalR connection
                store.connectionStore.startConnection()
                store.connectionStore.joinChatRoom(response.data.roomId)
            }
            var desiredChatRoom = store.matchStore.Chatrooms.find(x => x.roomId == response.data.roomId)

            var result: any = {
                isMatched: response.data.isMatch,
                chatRoom: desiredChatRoom,
            }
            return result
        }
        catch (error) {
            throw error;
        }

    }


    genFaceMatch = async (file?: File) => {
        if (file == undefined) {
            console.log("File is undefined")
            return
        }
        try {
            this.IsLoading = true
            console.log("File: ", file)
            const formData = new FormData();
            formData.append("newImage", file, file.name); // Specify the file type explicitly
            console.log("FormData:", formData);
            if (formData.has("newImage")) {
                console.log("File appended to FormData");
            } else {
                console.warn("File not appended to FormData");
            }

            const result = (await agent.Discover.genFaceMatch(formData)).data;
            console.log(result)
            this.IsLoading = false

            return result
        }
        catch (ex) {
            console.log(ex)
            this.IsLoading = false

            throw ex;
        }
    }

}