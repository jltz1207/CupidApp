import React from 'react'
import { InputElement } from '../../../../../component/FormElement/InputElement';
import { TextAreaElement } from '../../../../../component/FormElement/TextAreaElement';
import LoginButton from '../../../../../component/FormElement/Login/LoginButton';
import { ProfileModel } from '../../../../../Model/User';
import GptStore from './../../../../../store/GptStore';
import { store } from '../../../../../store/Store';
interface Prop {
    setBio: (s: string) => void
    record:any
    setRecord:(p:any)=>void
    AiInfoOpen: boolean
    setAiInfoOpen: (b: boolean) => void
    isUpdate?:boolean
}
export default function AiBioInfo({isUpdate, record, setRecord, AiInfoOpen, setAiInfoOpen, setBio}: Prop) {
    const handleChildClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    };

    const  handleSubmit =async()=>{
        console.log(record)
        if(!isUpdate){
            await store.gptStore.GenerateAiBio(record ).then(async (res)=>{
                setBio(res)
                setAiInfoOpen(false)
                 await store.summaryStore.sleep(5000);
                store.summaryStore.setRateOpen(6)
            })
        }   
        else{
            await store.gptStore.GenUpdateBio(record ).then(async (res)=>{
                setBio(res as string)
                setAiInfoOpen(false)
                 await store.summaryStore.sleep(5000);
                store.summaryStore.setRateOpen(6)
            })
        }
        
        
    }

    if (!AiInfoOpen)
        return null
    return (
        <div style={{ zIndex: 100 }} className=" fixed top-0 left-0 w-full h-full blur-overlay-normal" onClick={() => { setAiInfoOpen(false) }}>
            <div className="info-info-table p-3 flex flex-col gap-2" onClick={handleChildClick}>
                <InputElement title={"What You're Looking For?"} value={record.lookingFor} name="lookingFor" isRequired={false} record={record} setRecord={setRecord} />
                <TextAreaElement title={"Other Details:"} value={record.otherDetails} name="otherDetails" isRequired={false} record={record} setRecord={setRecord} />
                <div className="flex flex-nowrap gap-2 justify-center mt-4">
                    <LoginButton title={'AI-Generate'} handleClick={handleSubmit} width='200' />
                    <LoginButton color="#b2b8b4" title={'Cancel'} handleClick={()=>{setAiInfoOpen(false)}} width='200' />
                </div>
            </div>
        </div>
    )
}
