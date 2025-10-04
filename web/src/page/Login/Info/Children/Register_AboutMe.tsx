import React, { useState } from 'react'
import { ProfileModel } from '../../../../Model/User'
import RegisterHeading from '../../../../component/FormElement/Login/Register/RegisterHeading'
import Tag from '../../../../component/FormElement/Login/Register/Tag/Tag'
import LoginButton from '../../../../component/FormElement/Login/LoginButton'
import { observer } from 'mobx-react-lite'
import SummaryStore from '../../../../store/SummaryStore';
import { store } from '../../../../store/Store'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

interface prop {
    setPage: (n: Number) => void
    record: ProfileModel
    setRecord: (model: ProfileModel) => void
}
//focus on the personality of the user
export default observer(function Register_AboutMe({ record, setRecord, setPage }: prop) {

    const headingTitle = "About Me" 
    const headingContent = "Let everyone know who you're."

    const [AboutMeIds, setAboutMeIds] = useState<number[]>(record.aboutMeIds)

    const { AboutMe_Tags, getAboutMeList } = store.summaryStore

    useEffect(() => {
        getAboutMeList().then((tags) => {
            console.log(AboutMe_Tags)

        });
    }, [])

    const handleClick = (id: number) => {
        if (AboutMeIds.includes(id)) {
            setAboutMeIds(AboutMeIds.filter(x => x !== id))
        }
        else {
            setAboutMeIds([...AboutMeIds, id])
        }
    }

    const navigate = useNavigate()

    const handleNext = () => {
        setRecord({ ...record, aboutMeIds: AboutMeIds })

        setPage(5)
    }

    const showTags = AboutMe_Tags.map((item, idx) => (
        <Tag clicked={record.aboutMeIds.includes(item.id)} data={item} handleClick={() => { handleClick(item.id) }} />

    ))

    return (
        <div className="regInfo-children">
            <RegisterHeading title={headingTitle} content={headingContent} />
            <div className="tag-container">
                {showTags}

            </div>
            <div className="flex flex-nowrap gap-2 justify-center mt-4">
                <LoginButton title={'Next'} handleClick={handleNext} width='200' />
                <LoginButton color="#b2b8b4" title={'Back'} handleClick={() => setPage(3)} width='200' />
            </div>
        </div>
    )
})
