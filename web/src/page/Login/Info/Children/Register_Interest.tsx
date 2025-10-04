import React, { useState } from 'react'
import { ProfileModel } from '../../../../Model/User'
import RegisterHeading from '../../../../component/FormElement/Login/Register/RegisterHeading'
import Tag from '../../../../component/FormElement/Login/Register/Tag/Tag'
import LoginButton from '../../../../component/FormElement/Login/LoginButton'
import { observer } from 'mobx-react-lite'
import SummaryStore from './../../../../store/SummaryStore';
import { store } from '../../../../store/Store'
import { useEffect } from 'react';

interface prop {
    setPage: (n: Number) => void
    record: ProfileModel
    setRecord: (model: ProfileModel) => void
}

export default observer(function Register_Interest({ record, setRecord, setPage }: prop) {

    const headingTitle = "Interests"
    const headingContent = "Let everyone know what you're passionate about by adding it to your profile."
    const [InterestIds, setInterestIds] = useState<number[]>(record.interestIds)

    const { Interest_Tags, getInterestList } = store.summaryStore

    useEffect(() => {
        getInterestList().then((tags) => {
            console.log(Interest_Tags)

        });
    }, [])

    const handleClick = (id: number) => {
        if (InterestIds.includes(id)) {
            setInterestIds(InterestIds.filter(x => x !== id))
        }
        else {
            setInterestIds([...InterestIds, id])
        }
    }


    const handleNext = () => {
        setRecord({ ...record, interestIds: InterestIds })
        setPage(3)
    }

    const showTags = Interest_Tags.map((item, idx) => (
        
        <Tag clicked={record.interestIds.includes(item.id)} data={item} handleClick={() => { handleClick(item.id) }} />

    ))

    return (
        <div className="regInfo-children   ">
            <RegisterHeading title={headingTitle} content={headingContent} />
            <div className="tag-container">
                {showTags}
            </div>
            

            <div className="flex flex-nowrap gap-2 justify-center mt-4" onClick={()=>{console.log(record.interestIds)}}>
                <LoginButton title={'Next'} handleClick={handleNext} width='200' />
                <LoginButton color="#b2b8b4" title={'Back'} handleClick={() => setPage(1)} width='200' />
            </div>


        </div>
    )
})
