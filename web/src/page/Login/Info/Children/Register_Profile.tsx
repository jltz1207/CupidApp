import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../../store/Store';
import { InputElement } from '../../../../component/FormElement/InputElement';
import { CustomCalendar } from '../../../../component/FormElement/CustomCalendar';
import LoginButton from '../../../../component/FormElement/Login/LoginButton';
import { observer } from 'mobx-react-lite';
import { SelectElement } from '../../../../component/FormElement/SelectElement';
import { ProfileModel } from '../../../../Model/User';
import RadioElement from '../../../../component/FormElement/RadioElement';
import RegisterHeading from '../../../../component/FormElement/Login/Register/RegisterHeading';
import LoginSecondaryButton from '../../../../component/FormElement/Login/LoginSecondaryButton';
import { RangeSliderElement } from '../../../../component/FormElement/RangeSliderElement';

interface prop {
    setPage: (n: Number) => void
    record: ProfileModel
    setRecord: React.Dispatch<React.SetStateAction<ProfileModel>>
}

export default observer(function Register_Profile({ record, setRecord, setPage }: prop) {
    const navigate = useNavigate();
    const store = useStore()
    const { accountStore } = store
    const { isRegInfoOpen, User } = accountStore

    const handleValidation = () => {
        console.log("i")
        setPage(1);
    }

    const genderOptions = [ { name: "Male", value: 0 }, { name: "Female", value: 1 },]
    const showMeOptions = [{ name: "Male", value: 0}, { name: "Female", value:1}, { name: "Everyone", value: 2 }]

    const headingTitle= "Hi, "+ User?.email
    const headingContent= "You need to fill in your information to proceed."

    const log = ()=>{
        console.log(record)
    }

    return (
        <div className="regInfo-children" onClick={log}>
            <RegisterHeading title={headingTitle} content={headingContent} />
            <div className=" flex flex-col gap-4">
                <InputElement value={record.name} title={"Name"} name={"name"} isRequired={false} record={record!} setRecord={setRecord} error={""} />
                <CustomCalendar value={record.dateOfBirth} title="Date of Birth" name="dateOfBirth" record={record} setRecord={setRecord} />
                <RadioElement type='boolean' name="gender" defaultValue={Number(record.gender)} title="Gender" isRequired={false} options={genderOptions} setRecord={setRecord} />
                <RadioElement type='number' name="showMe" defaultValue={record.showMe} title="Show Me" isRequired={false} options={showMeOptions} setRecord={setRecord} />
                <RangeSliderElement minValue={record.showMeMinAge} maxValue={record.showMeMaxAge} title="Show me Age (between 18-65)" name="showMeMinAge" secondName="showMeMaxAge"  isRequired={false} setRecord={setRecord} record ={record}  />
              
              
                <LoginButton isSubmit={false} title={"Next"} handleClick={handleValidation} />
                <LoginSecondaryButton title={"Logout"} handleClick={store.accountStore.Logout} />
            </div>

        </div>
    )
})
