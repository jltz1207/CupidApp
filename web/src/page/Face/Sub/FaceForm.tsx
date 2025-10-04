import React, { useState } from 'react'
import RegisterHeading from '../../../component/FormElement/Login/Register/RegisterHeading'
import SingleImageUpload from '../../../component/FormElement/Image/SingleImageUpload'
import LoginButton from '../../../component/FormElement/Login/LoginButton'
import { store } from '../../../store/Store'
import { UserDto_Detailed } from '../../../Model/Discover'
import { observer } from 'mobx-react-lite'

interface Prop {
  setErorrMsg: (s?: string) => void
  setResultUser: (u?: UserDto_Detailed) => void
}
export default observer(function FaceForm(p: Prop) {

  const { discoverStore, summaryStore } = store
  const { setRateOpen, sleep } = summaryStore
  var headingTitle = "Face Similar Match"
  var headingContent = "Provide your favour photo, to get your perfect match."

  const [file, setFile] = useState<File>()

  const handleClick = async () => {
    if (file == undefined) {
      p.setErorrMsg("The photo is not uploaded." as string)
      return;
    }
    p.setErorrMsg()
    await discoverStore.genFaceMatch(file).then(
      async(i) => {
        p.setResultUser(i)
        await sleep(2000)
        setRateOpen(2)

      }

    )
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          p.setErorrMsg(err.response.data.error as string)
        }

      }

      )
  }
  return (
    <div className="px-12  flex flex-col  gap-12 border-r-2 border-[#ACACAC]  ">
      <RegisterHeading title={headingTitle} content={headingContent} />
      <div className="border-2 rounded-lg border-[#ACACAC] border-dashed flex flex-col gap-5 p-8 ">
        <span className="text-[24px]">
          Upload Photo
        </span>
        <SingleImageUpload file={file} setFile={setFile} />
      </div>
      <div className="px-4">
        <LoginButton title={"Generate Match"} handleClick={handleClick} />

      </div>
    </div>
  )
})
