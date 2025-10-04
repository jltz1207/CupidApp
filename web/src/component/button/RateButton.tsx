import { observer } from 'mobx-react-lite'
import React from 'react'
import { store } from '../../store/Store'

export default observer(function RateButton() {
  const {FinalRateOpen, setFinalRate} = store.summaryStore
  var src = FinalRateOpen?'/asset/button/rate/rate.png':'/asset/button/rate/crossedRate.png'
  return (
    <div className="fixed left-1 bottom-1 w-14 h-14 z-20 rounded-full bg-[#000000] p-2">
    <img src={src} className="cursor-pointer w-full h-full" onClick={setFinalRate} />

    </div>
  )
})
