import React, { useState } from 'react'
import { AccountForm, IAccountFormError } from '../../../Model/Account'
import { LoginInput } from '../../../component/FormElement/Login/LoginInput'
import ToolButton from '../../../component/button/ToolButton'
import LoginButton from '../../../component/FormElement/Login/LoginButton'

export interface Prop {
    record: AccountForm
    setRecord: (a: AccountForm) => void
    loginSection: () => JSX.Element
    enterLog: boolean
    setEnterLog: (b: boolean) => void
    errors: Partial<IAccountFormError>
    handleValidation?: (field: string, value: any) => void

}

export default function Account_Login(p: Prop) {

const handleExitLog = ()=>{
    p.setEnterLog(false)
    p.setRecord({...p.record, email:undefined,newPassword:undefined, confirmPassword:undefined,oldPassword:undefined })
}
    return (
        <div className={`flex flex-col gap-5 flex-grow p-8 `}>
            <span className="text-[25px] font-semi">
                Login Information
            </span>




            <div className={` border-2 border-[#ACACAC] ${p.enterLog ? 'p-8' : ''} h-[350px]`}>

                {!p.enterLog ?

                    <div className="flex  flex-col h-full   ">
                        <div className="p-4 text-[24px] w-full border-b-2 border-[#ACACAC] flex-grow">
                            Account Details
                            <p style={{ overflowWrap: 'break-word' }} className={` mt-4`}>
                                You have 18 passwords saved in your Google Account. Password
                                Manager makes it  <br />easier to sign in to sites and appsyou use on any
                                signed-in device.
                            </p>
                        </div>

                        <div className="text-[#111111]  p-3 mt-auto hover:bg-[#F6F6F6] cursor-pointer" onClick={() => p.setEnterLog(true)}>
                            <span className="text-[#1158CA] ">
                                Edit Account Details
                            </span>
                        </div>
                    </div>
                    : <div className="flex flex-col gap-4 relative">
                        <div className="rounded-lg p-1 hover:bg-[#E9E7E7] cursor-pointer absolute right-0 top-[-10px] w-12">
                            <img className="w-full h-full" src="/asset/button/general/back.png" onClick={handleExitLog} />

                        </div>

                        <span className="text-[24px]">
                            Account Details
                        </span>
                        <div className={`flex flex-col gap-3 w-[800px] `}>
                            <LoginInput handleValidation={p.handleValidation} error={p.errors.email} title={"Email Address"} name={"email"} value={p.record.email} record={p.record} setRecord={p.setRecord} />
                            <LoginInput handleValidation={p.handleValidation} error={p.errors.oldPassword} title={"Old Password"} name={"oldPassword"} value={p.record.oldPassword} record={p.record} setRecord={p.setRecord} isPassword={true} />
                            <LoginInput handleValidation={p.handleValidation} error={p.errors.newPassword} title={"New Password"} name={"newPassword"} value={p.record.newPassword} record={p.record} setRecord={p.setRecord} isPassword={true} />
                            <LoginInput handleValidation={p.handleValidation} error={p.errors.confirmPassword} title={"Confirm Password"} name={"confirmPassword"} value={p.record.confirmPassword} record={p.record} setRecord={p.setRecord} isPassword={true} />

                        </div>
                    </div>

                }


            </div>

            {p.loginSection()}

        </div>
    )
}
