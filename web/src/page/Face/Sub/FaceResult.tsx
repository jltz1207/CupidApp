import React, { useState } from 'react'
import FaceMatchDetails from './FaceMatchDetails'
import { UserDto_Detailed } from '../../../Model/Discover'
import { observer } from 'mobx-react-lite'
import MatchedInfo from '../../Discover/Matched/MatchedInfo'
import { store } from '../../../store/Store'
import { toast } from 'react-toastify'

interface Prop {
  errorMsg?: string
  resultUser?: UserDto_Detailed
  setResultUser: (u?: UserDto_Detailed) => void
}
export default observer(function FaceResult(p: Prop) {
  const [matchedUser, setMatchedUser,] = useState<UserDto_Detailed | undefined>()

  const { handleFaceLike, setOpenMatchedInfo } = store.discoverStore

  const handleFinalLike = async (userId: string) => [
    await handleFaceLike(userId).then((res) => {
      toast.success(`Successfully Like ` + p.resultUser?.name);

      if (res.isMatched == true) {
        setMatchedUser(p.resultUser)
        setOpenMatchedInfo(true)
      }
      p.setResultUser(undefined)

    })
  ]
  if (p.errorMsg != undefined)
    return (
      <div className="flex-grow h-full flex items-center justify-center">
        <span className="text-warn-red">{p.errorMsg}</span>
      </div>
    )
  return (
    <div className="flex-grow h-full p-8">
      <MatchedInfo matchedUser={matchedUser} />

      <FaceMatchDetails handleFinalLike={handleFinalLike} user={p.resultUser} />
    </div>
  )
})
