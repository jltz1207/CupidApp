import React, { useState } from 'react'
import { ProfileModel } from '../../../../Model/User'
import RegisterHeading from '../../../../component/FormElement/Login/Register/RegisterHeading'
import Tag from '../../../../component/FormElement/Login/Register/Tag/Tag'
import LoginButton from '../../../../component/FormElement/Login/LoginButton'
import { observer } from 'mobx-react-lite'
import SummaryStore from '../../../../store/SummaryStore';
import { store, useStore } from '../../../../store/Store'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import TextAreaBar from '../../../../component/chat/TextAreaBar'
import { BtnProp } from '../../../Match/MatchChatRoom'
import AiBioInfo from './Bio/AiBioInfo'

interface prop {
    setPage: (n: Number) => void
    record: ProfileModel
    setRecord: (model: ProfileModel) => void
}


export default observer(function Register_Bio({ record, setRecord, setPage }: prop) {
    const bioBtnList: BtnProp[] = [
        
        {
            ButtonDiv: () => {
                const [isVisible, setVisible] = useState<boolean>(false)
                return (
                    <button className="relative hover:bg-[#E9E7E7]  w-8 p-[2px] rounded-md " onClick={() => { setAiInfoOpen(true) }} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
                        <img alt="Ai" src={"/asset/chatroom/function/ai.png"} className="cursor-pointer inline-block  w-full" />
                        {isVisible &&
                            <span className="absolute top-full right-0 bg-[#FFFFFF] ">Ai Generate</span>
                        }
                    </button>)
            }
        }
    ]
    
    const [AiInfoOpen, setAiInfoOpen] = useState<boolean>(false);
    const headingTitle = "Bio"
    const headingContent = "Let everyone understand you deeper."

    const [bio, setBio] = useState<string>("")

    const {User} = store.accountStore 


    const navigate = useNavigate()

    const handleNext = () => {
        setRecord({ ...record, bio: bio })

        if (store.accountStore.User == null) {
            navigate('/')
            return;
        }

        store.accountStore.Submit_Profile({ ...record, id:User?.id??"",bio: bio }).then((i) => {
            navigate("/home")
        })
    }

    
    return (
        <div className={`regInfo-children`}>
            <div className={` ${AiInfoOpen ? 'blur-overlay' : ''}`}></div>
            <AiBioInfo record={record} setRecord={setRecord} setBio={setBio} AiInfoOpen={AiInfoOpen} setAiInfoOpen={setAiInfoOpen} />
            <RegisterHeading title={headingTitle} content={headingContent} />
            <TextAreaBar inputValue={bio} setInputValue={setBio} btnList={bioBtnList} />
            <div className="flex flex-nowrap gap-2 justify-center mt-4">
                <LoginButton title={'Next'} handleClick={handleNext} width='200' />
                <LoginButton color="#b2b8b4" title={'Back'} handleClick={() => setPage(4)} width='200' />
            </div>
        </div>
    )
})
