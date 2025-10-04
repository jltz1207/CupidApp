import React, { useState } from 'react'
import { UserDto_Detailed } from '../../../Model/Discover'
import { observer } from 'mobx-react-lite'
import FaceUserInformation from './FaceUserInformation'
import ToolBar from '../../Discover/Children/ToolBar'
import { ToolProp } from '../../Discover/DiscoverDashBoard'
import ReportInfo from '../../Discover/Report/ReportInfo'
import { store } from '../../../store/Store'
interface Prop {
  user?: UserDto_Detailed
  handleFinalLike:(str:string)=>void
}
export default observer(function FaceMatchDetails({handleFinalLike, user }: Prop) {

  const { handleFaceLike } = store.discoverStore;
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
  {
    handleClick: () => {
      if (user) {
        handleFinalLike(user.id)
      }
      else {
        console.log("User is missing")
      }
    },
    imgSrc: "/asset/button/tool/like.png"
  },
    //{ handleClick: () => { handleDislike() }, imgSrc: "/asset/button/tool/dislike.png" },
  ]



  if (user == undefined) {
    return null
  }
  return (
    <div className="flex flex-col  w-full gap-8">
      <ReportInfo isOpened={isReportOpened} setOpen={setReportOpened} />
      <span className="text-[20px]">
        Result:
      </span>
      <div className="flex gap-16">
        <div className=" flex flex-col items-center gap-8 justify-center">
          <div className=" w-[600px] h-[650px]  rounded-[20px]   drop-shadow-2xl border-2 border-[#c7c6c3]">
            <img src={user.profileFiles[0]} className="w-full h-[600px]  rounded-t-[20px]" />

            <div className="p-3">
              <span>{user.name}, {user.age}</span>
            </div>
          </div>
          <ToolBar tools={Tools} />
        </div>
        <FaceUserInformation user={user} />
      </div>



    </div>
  )
})
