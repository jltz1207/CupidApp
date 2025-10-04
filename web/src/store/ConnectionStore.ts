// Correct import using named exports
import * as signalR from '@microsoft/signalr';
import { makeAutoObservable } from "mobx";
import { store } from "./Store";
import { UserConnection } from '../Model/UserConnection';

export default class ConnectionStore {
    connection: signalR.HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    initSignalRConnection = async () => {
        if (this.connection != null) {
            return;
        }
        // Initialize the SignalR connection
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7053/chathub")
            .build();

        await this.startConnection()

        this.connection.on("ReceiveMessage", (msgId, key, senderId, roomId, message) => {

            if (store.accountStore.User != null && senderId != store.accountStore.User.id) { // to receiver
                store.matchStore.Receive_ClientMsg(msgId, senderId, store.accountStore.User.id, roomId, message)
                console.log(" message received: ", senderId, roomId, message);
                store.matchStore.ReadMessages_whenReceive(roomId, msgId)
            }
            else { // to sender, 200 Ok and updateid
                store.matchStore.handleSendMsg_200Ok(msgId, key)
                console.log("message ", msgId, " was sent successfully")
            }
        });


        this.connection.on("MessagesRead", (messageId: number[], datetime: string) => {
            console.log("messages read by receiver")
            store.matchStore.handleMsgReadByReceiver_200Ok(messageId, datetime);


        })
        this.connection.on("MessageRead", (messageId: number, datetime: string) => {
            console.log("messages read by receiver")
            store.matchStore.handleMsgReadByReceiver_200Ok(messageId, datetime);


        })
    }

    startConnection = async () => {
        if (this.connection && this.connection.state !== signalR.HubConnectionState.Connected) {
            try {
                await this.connection.start();
                console.log("Connected to SignalR server!");
            } catch (err) {
                console.error("SignalR connection failed:", err);
            }
        }
    }

    joinChatRoom = async (roomId: string) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            try {
                await this.connection.invoke("JoinChatRoom", {
                    userId: store.accountStore.User?.id,
                    roomId: roomId
                });
            } catch (err) {
                console.error('Error joining chat room:', err);
            }
        }
    }
    joinChatRooms = async (roomIds: string[]) => {

        try {

            for (let rId of roomIds) {
                if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
                    console.log(rId)
                    await this.connection.invoke("JoinChatRoom", {
                        userId: store.accountStore.User?.id,
                        roomId: rId
                    });
                }
            }
        } catch (err) {
            console.error('Error joining chat room:', err);
        }
    }

    sendMessage = async (key: number, roomId: string, message: string, receiverId: string) => {
        console.log(roomId, message, receiverId, store.accountStore.User?.id)
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {

            try {
                await this.connection.invoke("SendMessage",
                    {
                        userId: store.accountStore.User?.id,
                        roomId: roomId
                    } as UserConnection,

                    message,
                    receiverId,
                    key

                );
            } catch (err) {
                console.error('Error joining chat room:', err);
            }
        }
    }

    readMessage = async (msgId: number[] | number, conn: UserConnection, hkt: Date) => {

        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {

            try {
                console.log(msgId, conn, hkt)
                Array.isArray(msgId) ?
                    await this.connection.invoke("ReadMessages",
                        conn,
                        msgId,
                        hkt
                    )
                    :
                    await this.connection.invoke("ReadMessage",
                        conn,
                        msgId,
                        hkt
                    )
            } catch (err) {
                console.error('Error joining chat room:', err);
            }
        }
    }


}


