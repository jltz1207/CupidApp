import React, { useEffect, useRef, useState } from 'react'
import { AiGenForm } from '../../../Model/AiGen'
import RadioElement from '../../FormElement/RadioElement'
import LoginButton from '../../FormElement/Login/LoginButton'
import { store } from '../../../store/Store'
import { ToastContainer, toast } from "react-toastify";
import { RatingIcon } from 'semantic-ui-react'
import RatingInfo from '../../../page/Rate/RatingInfo'
import ReplyResultInfo from '../ReplyResultInfo/ReplyResultInfo'

interface Prop {
    isOpen: boolean
    setOpen: (b: boolean) => void
}

export default function AiGenInfo({ isOpen, setOpen }: Prop) {
    const [isResultOpen, setResultOpen] = useState<boolean>(true)
    const {summaryStore} = store
    const {Chatrooms, roomIdx } = store.matchStore;
    const [record, setRecord] = useState<AiGenForm>({ tone: 0, word: 0, roomId: '' })

    const toneOptions = [{ name: "Friendly", value: 0 }, { name: "Serious", value: 1 }, { name: "Humorous", value: 2 }, { name: "Casual", value: 3 },]
    const wordOptions = [{ name: "Short", value: 0 }, { name: "Medium", value: 1 }, { name: "Long", value: 2 }]

    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = () => {
        store.matchStore.genAiResponse({ ...record, roomId: Chatrooms[roomIdx].roomId })
        .then((i) => {
            store.matchStore.setAnswer(i)
            store.matchStore.setAnswerOpenClose(true)
            setOpen(false)
            setResultOpen(true)
           // summaryStore.setRateOpen(1)
        })
        .catch(
            (error) => {

                toast.warn(error.response.data);
                console.log(error.response.data)
                setOpen(false)
            }
        )
    }

    if (isOpen == false) return null
    return (
        <div ref={wrapperRef} className="min-w-32 absolute bg-[#FFF] right-0 bottom-full p-4 rounded-xl border-2 border-[#000] flex flex-col gap-4 z-40">
            <RadioElement type='number' name="tone" defaultValue={record.tone} title="Tone" isRequired={false} options={toneOptions} setRecord={setRecord} />
            <RadioElement type='number' name="word" defaultValue={record.word} title="Word" isRequired={false} options={wordOptions} setRecord={setRecord} />
            <div className="px-8">
                <LoginButton title={'AI-Generate'} handleClick={handleSubmit} />
            </div>
        </div>
    )

}