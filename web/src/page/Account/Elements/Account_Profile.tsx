import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react'
import ProfileImage from '../../../component/NavBar/AccountBoard/Profile/ProfileImage'
import RadioElement from '../../../component/FormElement/RadioElement'
import { AccountForm, BioForm, IAccountFormError } from '../../../Model/Account'
import AiBioInfo from '../../Login/Info/Children/Bio/AiBioInfo'
import RegisterHeading from '../../../component/FormElement/Login/Register/RegisterHeading'
import TextAreaBar from '../../../component/chat/TextAreaBar'
import { BtnProp } from '../../Match/MatchChatRoom'
import { InputElement } from '../../../component/FormElement/InputElement'
import { CustomCalendar } from '../../../component/FormElement/CustomCalendar'
import ImageUploadContainer from '../../Login/Info/Children/ImageUpload/ImageUploadContainer'
import { JsxElement } from 'typescript'
import { RangeSliderElement } from '../../../component/FormElement/RangeSliderElement'

interface Prop {
    record: AccountForm
    setRecord: React.Dispatch<React.SetStateAction<AccountForm>>
    loginSection: () => JSX.Element
    handleValidation: (field: string, value: any) => void
    errors: Partial<IAccountFormError>
}
export default function Account_Profile(p: Prop) {


    const bioBtnList: BtnProp[] = [
        // {
        //     ButtonDiv: () => {
        //         const [isVisible, setVisible] = useState<boolean>(false)

        //         return (
        //             <button className="relative hover:bg-[#E9E7E7] w-8 p-[2px] rounded-md " onClick={() => { }} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        //                 <img alt="hi" src={"/asset/chatroom/function/grammarly.png"} className="cursor-pointer w-full inline-block " />
        //                 {isVisible &&
        //                     <span className="absolute top-full right-0 bg-[#FFFFFF] ">Grammarly</span>
        //                 }
        //             </button>)
        //     }
        // }
        // ,
        {
            ButtonDiv: () => {
                const [isVisible, setVisible] = useState<boolean>(false)
                return (
                    <button className="relative hover:bg-[#E9E7E7]  w-8 p-[2px] rounded-md " onClick={() => { setAiInfoOpen(true) }} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
                        <img alt="Ai" src={"/asset/chatroom/function/ai.png"} className="cursor-pointer inline-block  w-full" />
                        {isVisible &&
                            <span className="absolute top-full right-0 bg-[#FFFFFF] ">Ai Generate</span>
                        }
                    </button>)
            }
        }
    ]

    const [AiInfoOpen, setAiInfoOpen] = useState<boolean>(false);

    const setBioInput = (s: string) => {
        p.handleValidation("bio", s)
        p.setRecord({ ...p.record, bio: s })
    }

    const showMeOptions = [{ name: "Male", value: 0 }, { name: "Female", value: 1 }, { name: "Everyone", value: 2 }]
    const genderOptions = [{ name: "Male", value: 0 }, { name: "Female", value: 1 },]

    const setFiles = (newFiles: (File | undefined)[]) => {
        p.setRecord({ ...p.record, newProfileFiles: newFiles })
        p.handleValidation("newProfileFiles", newFiles)
    }
    const showError = () => {
        console.log(p.errors)
    }

    const [bioForm, setBioForm] = useState<BioForm>(new BioForm());
    
    
    return (
        <div className={`h-screen overflow-y-auto flex flex-col gap-5 flex-grow p-8 pb-32 `}>
            <span className="text-[25px] font-semi" onClick={showError}>
                My Profile
            </span>

            <div className="border-2 border-[#ACACAC] flex  flex-col py-6 px-8 gap-4">
                <span className="text-[24px]">
                    Profile Pictures
                </span>
                {/* <ProfileImage width={80} height={80} /> */}
                <ImageUploadContainer handleValidation={p.handleValidation} error={p.errors.newProfileFiles} files={p.record.newProfileFiles} setFiles={setFiles} />

            </div>

            <div className="border-2 border-[#ACACAC] flex flex-col gap-5 p-8">
                <span className="text-[24px]">
                    Personal Information
                </span>
                <div className="flex flex-col gap-4">
                    <RadioElement type='boolean' name="gender" defaultValue={Number(p.record.gender)} title="Gender" isRequired={false} options={genderOptions} setRecord={p.setRecord} />
                    <InputElement error={p.errors.name} handleValidation={p.handleValidation} value={p.record.name} title={"Name"} name={"name"} isRequired={false} record={p.record!} setRecord={p.setRecord} />
                    <CustomCalendar handleValidation={p.handleValidation} error={p.errors.dateOfBirth} value={p.record.dateOfBirth} title="Date of Birth" name="dateOfBirth" record={p.record} setRecord={p.setRecord} />
                </div>
            </div>
            <div className="border-2 border-[#ACACAC] flex flex-col gap-5 p-8">
                <span className="text-[24px]">
                    Other Details
                </span>
                <div className="flex flex-col gap-4">
                    <RadioElement type='number' name="showMe" defaultValue={p.record.showMe} title="Show Me Gender" isRequired={false} options={showMeOptions} setRecord={p.setRecord} />
                    <RangeSliderElement minValue={p.record.showMeMinAge} maxValue={p.record.showMeMaxAge} title="Show me Age (between 18-65)" name="showMeMinAge" secondName="showMeMaxAge" isRequired={false} setRecord={p.setRecord} record={p.record} />
                    <AiBioInfo isUpdate={true} record={bioForm} setRecord={setBioForm} setBio={setBioInput} AiInfoOpen={AiInfoOpen} setAiInfoOpen={setAiInfoOpen} />
                    <div>
                        <RegisterHeading title={"Bio"} />
                        <TextAreaBar error={p.errors.bio} inputValue={p.record.bio} setInputValue={setBioInput} btnList={bioBtnList} />
                    </div>
                </div>


            </div>
            {p.loginSection()}

        </div>
    )
}
