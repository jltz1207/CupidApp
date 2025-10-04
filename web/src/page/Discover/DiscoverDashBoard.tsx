import React, { useEffect, useState } from 'react'
import ProfileCard from '../../component/Profile/ProfileCard'
import ToolButton from '../../component/button/ToolButton'
import ToolBar from './Children/ToolBar'
import ProfileDetails from '../../component/Profile/ProfileDetails'
import { store } from '../../store/Store'
import { UserDto_Detailed } from '../../Model/Discover'
import { observer } from 'mobx-react-lite'
import ImageScroller from '../../component/Profile/ImageScroller'
import { JsxElement } from 'typescript'
import ReportInfo from './Report/ReportInfo'



export interface ToolProp {
  handleClick: () => void
  imgSrc: string

  subDiv?: () => JSX.Element | null
}
interface Prop {
  handleFinalLike: () => void
}


export default observer(function DiscoverDashBoard(p: Prop) {
  const { handleDislike, handleLike } = store.discoverStore
  const { setRateOpen, FinalRateOpen } = store.summaryStore
  const [isSettingOpened, setSettingOpened] = useState<boolean>(false);

  const [isReportOpened, setReportOpened] = useState<boolean>(false);
  const settingObjs = [{
    name: "Report",
    handleClick: () => {
      setReportOpened(true)
      setSettingOpened(false)
    }
  },
  {
    name: "Cancel",
    handleClick: () => {
      setSettingOpened(false)
    }
  }]

  useEffect(() => {
    store.discoverStore.getRandomMatches()
  }, [])

  const Tools: ToolProp[] = [{
    handleClick: () => { setSettingOpened(!isSettingOpened) },
    imgSrc: "/asset/button/tool/setting.png",
    subDiv: () => {
      if (isSettingOpened == false)
        return null
      return (

        <div className="absolute  left-8 top-full border-2 border-[#C7C6C3]  shadow-lg  rounded-lg">
          {settingObjs.map((item, i) => (
            <div onClick={item.handleClick} className={`py-1 ${i !== settingObjs.length - 1 ? "border-b-2 border-[#C7C6C3]" : ""}`}>
              <span className={`w-full pl-2 pr-6 `}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )
    }
  },
  { handleClick: () => { p.handleFinalLike() }, imgSrc: "/asset/button/tool/like.png" },
  { handleClick: () => { handleDislike() }, imgSrc: "/asset/button/tool/dislike.png" },]


const handleRateOpen = ()=>{
  setRateOpen(5)
}


  return (
    <div className="flex h-full">
      <ReportInfo isOpened={isReportOpened} setOpen={setReportOpened} />
      <div className="w-[65%] flex flex-col items-center gap-8 justify-center">
        <ProfileCard />
        <ToolBar tools={Tools} />
      </div>
      <div className="flex-grow py-8 relative">
        <ProfileDetails />

      </div>
      {FinalRateOpen && <div onClick={handleRateOpen} className="  top-0 rounded-full border-2 border-[#000000] w-16 h-16 m-5 flex items-center justify-center cursor-pointer">
        Rate
      </div>
      }
    </div>

  )
})
