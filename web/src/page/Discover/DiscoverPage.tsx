import React, { useState } from 'react'
import DiscoverDashBoard from './DiscoverDashBoard'
import { store } from '../../store/Store';
import LoadingComponent from '../../component/Loading/LoadingComponent';
import { observer } from 'mobx-react-lite';
import MatchedInfo from './Matched/MatchedInfo';
import { ChatroomDto } from '../../Model/Chatroom';
import { UserDto_Detailed } from '../../Model/Discover';
import { toast } from 'react-toastify';

export default observer(function DiscoverPage() {
    const { IsLoading, handleLike, setOpenMatchedInfo, Current_OtherUsers ,UserIdx} = store.discoverStore;
    const [matchedUser, setMatchedUser] = useState<UserDto_Detailed|undefined>()
    const handleFinalLike = async () => [
        await handleLike().then((res) => {
            toast.success(`Successfully Like `+res.likedName);
            
            if (res.isMatched == true) {
                if(Current_OtherUsers!=null){
                    setMatchedUser(Current_OtherUsers[UserIdx])
                }
                setOpenMatchedInfo(true)
            }
        })
    ]
    return (
        <div className="page-parent">
            <MatchedInfo matchedUser={matchedUser}/>
            {IsLoading && <LoadingComponent content="Loading..." />}
            <DiscoverDashBoard handleFinalLike={handleFinalLike} />
        </div>
    )
})
