import React, { useState } from 'react'
import { ProfileModel } from '../../../../Model/User'
import RegisterHeading from '../../../../component/FormElement/Login/Register/RegisterHeading'
import Tag from '../../../../component/FormElement/Login/Register/Tag/Tag'
import LoginButton from '../../../../component/FormElement/Login/LoginButton'
import { observer } from 'mobx-react-lite'
import SummaryStore from '../../../../store/SummaryStore';
import { store } from '../../../../store/Store'
import { useEffect } from 'react';

interface prop {
    setPage: (n: Number) => void
    record: ProfileModel
    setRecord: (model: ProfileModel) => void
}

export default observer(function Register_Value({ record, setRecord, setPage }: prop) {

    const headingTitle = "Values"
    const headingContent = "Let everyone know what are your value."
    const [ValueIds, setValueIds] = useState<number[]>(record.valueIds)

    const {Value_Tags, getValueList } = store.summaryStore

    useEffect(() => {
        getValueList().then((tags) => {
            console.log(Value_Tags)

        });
    }, [])

    const handleClick = (id: number) => {
        if (ValueIds.includes(id)) {
            setValueIds(ValueIds.filter(x => x !== id))
        }
        else {
            setValueIds([...ValueIds, id])
        }
    }


    const handleNext = () => {
        setRecord({ ...record, valueIds: ValueIds })
        setPage(4)
    }

    const showTags = Value_Tags.map((item, idx) => (
        <Tag clicked={record.valueIds.includes(item.id)} data={item} handleClick={() => { handleClick(item.id) }} />

    ))

    return (
        <div className="regInfo-children">
            <RegisterHeading title={headingTitle} content={headingContent} />
            <div className="tag-container">
                {showTags}

            </div>
            <div className="flex flex-nowrap gap-2 justify-center mt-4">
                <LoginButton title={'Next'} handleClick={handleNext} width='200' />
                <LoginButton color="#b2b8b4" title={'Back'} handleClick={() => setPage(2)} width='200' />
            </div>
        </div>
    )
})
