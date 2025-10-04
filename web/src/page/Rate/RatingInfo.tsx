import React, { useEffect, useState } from 'react'
import InfoTemplate from '../../component/Info/InfoTemplate'
import StarComponents from './StarComponents'
import LoginButton from '../../component/FormElement/Login/LoginButton'
import { InputElement } from '../../component/FormElement/InputElement'
import { store } from '../../store/Store'
import { observer } from 'mobx-react-lite'



export default observer(function RatingInfo() {
  const {summaryStore} = store
  const [record, setRecord] = useState<any>({ marks: -1 })

  useEffect(() => {
    console.log(record)
  }, [record])

  const handleSubmit = () => {
    summaryStore.RateFunction(record).then(i =>summaryStore.setRateClose())

  }
  const content = () => (
    <div className="flex flex-col gap-3 p-8">
      <div className="flex justify-center mb-4">
        <div style={{ overflowWrap: 'break-word' }} className="text-[20px]">
          Give Us Your Opinion to this <span className="text-[20px] text-[#dd2716]">Function</span>.
        </div>
      </div>
      <span>
        {summaryStore.RateDetails}
      </span>
      <div>
        <p className="mb-1">Rate</p>
        <StarComponents record={record} setRecord={setRecord} />
      </div>
      <InputElement value={record.reason} title={"Reason (Optional)"} name={"reason"} isRequired={false} record={record!} setRecord={setRecord} />

      <div className="px-8">
        <LoginButton title={'Submit'} handleClick={handleSubmit} />
      </div>
    </div>
  )
  return (
    <InfoTemplate isOpened={summaryStore.isRateOpen && summaryStore.FinalRateOpen} content={content} />

  )

})
