import React, { useEffect, useState } from 'react'
import { InputElement } from '../../../component/FormElement/InputElement'
import { useStore } from '../../../store/Store'
import { observer } from 'mobx-react-lite'
import { CustomCalendar } from '../../../component/FormElement/CustomCalendar'
import LoginButton from '../../../component/FormElement/Login/LoginButton'
import { useNavigate } from 'react-router-dom'
import Register_Step1 from './Children/Register_Profile'
import Register_ImageUpload from './Children/Register_ImageUpload'
import { ProfileModel } from '../../../Model/User'
import Register_Profile from './Children/Register_Profile'
import Register_Interest from './Children/Register_Interest'
import Register_Value from './Children/Register_Value'
import Register_AboutMe from './Children/Register_AboutMe'
import Register_Bio from './Children/Register_Bio'
import Register_Weight from './Children/Register_Weight'

export default observer(function RegisterInfo() {
    const store = useStore()
    const date = new Date(2000, 0, 1); // Months are zero-indexed, so 0 represents January.
    const dateString = date.toISOString().split('T')[0]; // Convert to ISO string and extract the date part.
    const [record, setRecord] = useState<ProfileModel>({ name: '', dateOfBirth: dateString, id: store.accountStore.User?.id??'', showMe: -1, profileFiles: [], interestIds: [], aboutMeIds: [], valueIds: [], bio: "", lookingFor:"", otherDetails:"", showMeMinAge:18, showMeMaxAge:22, keywordWeight:-1, interestWeight:-1, aboutMeWeight:-1, valueWeight:-1, ageWeight:-1 })

    const { accountStore } = store
    const { isRegInfoOpen } = accountStore

    const navigate = useNavigate();

    const onSubmit = () => {
        if (accountStore.User == null) {
            navigate('/')
            return;
        }
        accountStore.Submit_Profile({ ...record, id: accountStore.User?.id }).then((i) => {
            navigate("/home")
        })
    }

    const [page, setPage] = useState<Number>(0)

    useEffect(() => {
        console.log(record)
    }, [record])

    if (!isRegInfoOpen)
        return null
    return (
        <div className="centered-flex-container">

            <div className="info-table flex">
                <div className="flex flex-col items-center justify-center w-full">
                    {page === 0 && <Register_Profile record={record} setRecord={setRecord} setPage={setPage} />}
                    {page === 1 && <Register_ImageUpload record={record} setRecord={setRecord} setPage={setPage} />}
                    {page === 2 && <Register_Interest record={record} setRecord={setRecord} setPage={setPage} />}
                    {page === 3 && <Register_Value record={record} setRecord={setRecord} setPage={setPage} />}
                    {page === 4 && <Register_AboutMe record={record} setRecord={setRecord} setPage={setPage} />}
                    {page === 5 && <Register_Weight record={record} setRecord={setRecord} setPage={setPage} />}
                    {page === 6 && <Register_Bio record={record} setRecord={setRecord} setPage={setPage} />}
                </div>


            </div>
        </div>
    )
})
