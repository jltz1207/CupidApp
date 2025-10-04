import React, { useEffect, useState } from 'react'
import MatchProfile from './MatchProfile'
import MatchTableList from './MatchTable/MatchTableList'
import MatchChatRoom from './MatchChatRoom'
import MatchStore from './../../store/MatchStore';
import { store } from '../../store/Store';
import { observer } from 'mobx-react-lite';
import RatingInfo from '../Rate/RatingInfo';
import ReplyResultInfo from '../../component/commonInfo/ReplyResultInfo/ReplyResultInfo';

export default observer(function MatchPage() {
    const {Chatrooms, setChatrooms} = store.matchStore
    const [showProfile, setShowProfile] = useState<boolean>(true)
    const { getUser, User, setRegInfo } = store.accountStore;
    const { joinChatRooms, initSignalRConnection } = store.connectionStore

    useEffect(() => {
        store.matchStore.GetChatRoomDetails()
        // console.log(User)
        //  initSignalRConnection();

        // if (User?.roomIds != undefined) {
        //    joinChatRooms(User.roomIds);
        // }
    }, [])
    
  

    return (
        <div className="chat-parent flex">
            <MatchTableList setShowProfile={setShowProfile}/>
            <MatchChatRoom />
            <MatchProfile showProfile={showProfile} setShowProfile={setShowProfile}  />
            
            <ReplyResultInfo />
        </div>
    )
})
