import React, { useEffect, useState } from 'react'

import { observer } from 'mobx-react-lite'
import { store } from '../../../store/Store'
import InfoTemplate from '../../../component/Info/InfoTemplate'
import { ChatroomDto } from '../../../Model/Chatroom'
import { UserDto_Detailed } from '../../../Model/Discover'

interface Prop {
  matchedUser: UserDto_Detailed | undefined
}

export default observer(function MatchedInfo(p: Prop) {
  const { discoverStore } = store
  const [record, setRecord] = useState<any>({ marks: -1 })

  useEffect(() => {
    console.log(record)
  }, [record])


  const content = () => (
    <div className="flex flex-col gap-3 p-8">
      <p>It is a Match with <span className="text-[#0081AB]">{p.matchedUser?.name}</span>.</p>
      <p>Please check it out later, and can start with {p.matchedUser?.name}.</p>
    </div>
  )
  return (
    <InfoTemplate setOpen={discoverStore.setOpenMatchedInfo} isOpened={discoverStore.IsOpenMatchedInfo} content={content} />

  )

})
