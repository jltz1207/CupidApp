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
import { SliderElement } from '../../../../component/FormElement/SliderElement'

interface prop {
  setPage: (n: Number) => void
  record: ProfileModel
  setRecord: (model: ProfileModel) => void
}
//focus on the personality of the user
export default observer(function Register_AboutMe({ record, setRecord, setPage }: prop) {

  const headingTitle = " Weightning (0-4)"
  const headingContent = "Weight each function to personize your matching algorithm"



  const navigate = useNavigate()

  const handleNext = () => {

    setPage(6)
  }



  return (
    <div className="regInfo-children">
      <RegisterHeading title={headingTitle} content={headingContent} />

      <div className="flex flex-col gap-2 mt-8 pl-4">
        <SliderElement value={record.keywordWeight} min={0} max={4} title="Extracted Keywords (Chat with Cupid, Bio)" name="keywordWeight" isRequired={false} setRecord={setRecord} record={record} />
        <SliderElement value={record.interestWeight} min={0} max={4} title="Common Interest Tag" name="interestWeight" isRequired={false} setRecord={setRecord} record={record} />
        <SliderElement value={record.aboutMeWeight} min={0} max={4} title="Common About Me Tag" name="aboutMeWeight" isRequired={false} setRecord={setRecord} record={record} />
        <SliderElement value={record.valueWeight} min={0} max={4} title="Common Value Tag" name="valueWeight" isRequired={false} setRecord={setRecord} record={record} />
        <SliderElement value={record.ageWeight} min={0} max={4} title="Expected Age" name="ageWeight" isRequired={false} setRecord={setRecord} record={record} />

      </div>

      <div className="flex flex-nowrap gap-2 justify-center mt-4">
        <LoginButton title={'Next'} handleClick={handleNext} width='200' />
        <LoginButton color="#b2b8b4" title={'Back'} handleClick={() => setPage(4)} width='200' />
      </div>
    </div>
  )
})
