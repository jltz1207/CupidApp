
import React, { useEffect, useState } from 'react'

import { observer } from 'mobx-react-lite'
import { store } from '../../../store/Store'
import LoginButton from '../../FormElement/Login/LoginButton'
import InfoTemplate from '../../Info/InfoTemplate'
import LoginSecondaryButton from '../../FormElement/Login/LoginSecondaryButton'



export default observer(function ReplyResultInfo() {

  const { matchStore } = store
  const {setInputValue} = matchStore
  const [record, setRecord] = useState<any>({ marks: -1 })

  useEffect(() => {
    console.log(record)
  }, [record])


  const content = () => (
    <div className="flex flex-col gap-3 p-8">
      <div className="flex justify-center mb-4">
        <span className="text-[20px]">
          The AI generate Reply is as follows.
        </span>
      </div>

      <div style={{ overflowWrap: 'break-word' }} className="border-2 p-3 rounded-lg">
        {matchStore.answer}
      </div>

      <div className="px-8 flex flex-col items-center">
        <LoginButton title={'Use'} handleClick={() => {if(matchStore.answer) setInputValue(matchStore.answer); matchStore.setAnswerOpenClose(false); store.summaryStore.setRateOpen(1) }} />
        <LoginSecondaryButton title={'Discard'} handleClick={() => { matchStore.setAnswerOpenClose(false); store.summaryStore.setRateOpen(1) }} />
      </div>
    </div>
  )
  return (
    <InfoTemplate isOpened={matchStore.isAnswerOpen} content={content} />

  )

})
