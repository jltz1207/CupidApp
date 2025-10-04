import React, { useEffect, useState } from 'react'
import Tag from '../../../component/FormElement/Login/Register/Tag/Tag'
import { store } from '../../../store/Store'
import TagContainer from './Sub/TagContainer'
import { AccountForm, IAccountFormError } from '../../../Model/Account'
import { Id_Name } from '../../../Model/Id_Name'
import { SliderElement } from '../../../component/FormElement/SliderElement'

interface Prop {
  record: AccountForm
  setRecord: (a: AccountForm) => void
  loginSection: () => JSX.Element
  handleValidation?: (field: string, value: any) => void
  errors: Partial<IAccountFormError>

}

export default function Account_Weight(p: Prop) {



  return (
    <div className="flex flex-col gap-5 flex-grow p-8">
      <span className="text-[25px] font-semi" onClick={()=> console.log(p.record.keywordWeight)}>
        Weightning (0-4)
      </span>
      <div className="border-2 border-[#ACACAC] flex flex-col gap-5 p-8">
      <SliderElement error={p.errors.keywordWeight} handleValidation={p.handleValidation} value={p.record.keywordWeight} min={0} max={4} title="Extracted Keywords (Chat with Cupid, Bio)" name="keywordWeight"   isRequired={false} setRecord={p.setRecord} record ={p.record}  />
      <SliderElement error={p.errors.interestWeight} handleValidation={p.handleValidation} value={p.record.interestWeight} min={0} max={4} title="Common Interest Tag" name="interestWeight"   isRequired={false} setRecord={p.setRecord} record ={p.record}  />
      <SliderElement error={p.errors.aboutMeWeight} handleValidation={p.handleValidation} value={p.record.aboutMeWeight} min={0} max={4} title="Common About Me Tag" name="aboutMeWeight"   isRequired={false} setRecord={p.setRecord} record ={p.record}  />
      <SliderElement error={p.errors.valueWeight} handleValidation={p.handleValidation} value={p.record.valueWeight} min={0} max={4} title="Common Value Tag" name="valueWeight"   isRequired={false} setRecord={p.setRecord} record ={p.record}  />
      <SliderElement error={p.errors.ageWeight} handleValidation={p.handleValidation} value={p.record.ageWeight} min={0} max={4} title="Expected Age" name="ageWeight"   isRequired={false} setRecord={p.setRecord} record ={p.record}  />

      </div>
      {p.loginSection()}

    </div>
  )
}
