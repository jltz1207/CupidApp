import React, { useEffect, useState } from 'react'
import Tag from '../../../component/FormElement/Login/Register/Tag/Tag'
import { store } from '../../../store/Store'
import TagContainer from './Sub/TagContainer'
import { AccountForm, IAccountFormError } from '../../../Model/Account'
import { Id_Name } from '../../../Model/Id_Name'

interface Prop {
  record: AccountForm
  setRecord: (a: AccountForm) => void
  loginSection:()=>JSX.Element
  handleValidation?: (field: string, value: any) => void
  errors:Partial<IAccountFormError>

}

export default function Account_Tag(p: Prop) {

  const { getInterestList, getAboutMeList, getValueList } = store.summaryStore

  const [aboutMeTags, setAboutMeTags] = useState<Id_Name[]>([])
  const [interestTags, setInterestTags] = useState<Id_Name[]>([])
  const [valueTags, setValueTags] = useState<Id_Name[]>([])

  const [tagElement, setTagElement] = useState<any>()

  const handleClick_AboutMe = (id: number) => {
    console.log(p.record.aboutMeIds, p.record.aboutMeIds.includes(id))


    if (p.record.aboutMeIds.includes(id)) {
      if(p.handleValidation) p.handleValidation("aboutMeIds", [...p.record.aboutMeIds.filter((x: number) => x !== id)])
      p.setRecord({
        ...p.record, aboutMeIds: [...p.record.aboutMeIds.filter((x: number) => x !== id)]
      })
    }
    else {
      if(p.handleValidation) p.handleValidation("aboutMeIds", [...p.record.aboutMeIds, id])

      p.setRecord({
        ...p.record, aboutMeIds: [...p.record.aboutMeIds, id]
      })
    }
  }
  const handleClick_Interest = (id: number) => {
    if (p.record.interestIds.includes(id)) {
      if(p.handleValidation) p.handleValidation("interestIds", [...p.record.interestIds.filter((x: number) => x !== id)])

      p.setRecord({
        ...p.record, interestIds: [...p.record.interestIds.filter((x: number) => x !== id)]
      })
    }
    else {
      if(p.handleValidation) p.handleValidation("interestIds", [...p.record.interestIds, id])

      p.setRecord({
        ...p.record, interestIds: [...p.record.interestIds, id]
      })
    }
  }


  const handleClick_Value = (id: number) => {
    if (p.record.valueIds.includes(id)) {
      if(p.handleValidation) p.handleValidation("valueIds", [...p.record.valueIds.filter((x: number) => x !== id)])

      p.setRecord({
        ...p.record, valueIds: [...p.record.valueIds.filter((x: number) => x !== id)]
      })
    }
    else {
      if(p.handleValidation) p.handleValidation("valueIds", [...p.record.valueIds, id])

      p.setRecord({
        ...p.record, valueIds: [...p.record.valueIds, id]
      })
    }
  }

  useEffect(() => {
    getAboutMeList().then((tags) => { if (tags) setAboutMeTags(tags) });
    getInterestList().then((tags) => { if (tags) setInterestTags(tags) });
    getValueList().then((tags) => { if (tags) setValueTags(tags) });
  }, [])

  return (
    <div className="h-screen overflow-y-auto  pb-32 flex flex-col gap-5 flex-grow p-8">
      <span className="text-[25px] font-semi">
        Tags
      </span>
      <TagContainer error={p.errors.aboutMeIds} handleClick={handleClick_AboutMe} tags={aboutMeTags} clickedIds={p.record.aboutMeIds} title="About Me" description={"Let everyone know what you're passionate about by adding it to your profile."} />
      <TagContainer error={p.errors.interestIds} handleClick={handleClick_Interest} tags={interestTags} clickedIds={p.record.interestIds} title="Interest" description={"Let everyone know what are your value."} />
      <TagContainer error={p.errors.valueIds} handleClick={handleClick_Value} tags={valueTags} clickedIds={p.record.valueIds} title="Value" description={"Let everyone know who you're"} />
      {p.loginSection()}
    
    </div>
  )
}
