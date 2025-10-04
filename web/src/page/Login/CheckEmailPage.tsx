import React, { useEffect, useState } from 'react'
import LoginButton from '../../component/FormElement/Login/LoginButton'
import { LoginInput } from '../../component/FormElement/Login/LoginInput'
import { useStore } from '../../store/Store';
import { EmailConfirmModel } from '../../Model/User';
import { useNavigate } from 'react-router-dom';
import LoginSecondaryButton from '../../component/FormElement/Login/LoginSecondaryButton';

export default function CheckEmailPage() {
    const store = useStore();
    const { accountStore } = store;
    const { User,PollEmailVerificationStatus } = accountStore
    const [context, setContext] = useState<string>("Registration Successful! Please check your email")
    const navigate = useNavigate();
    useEffect(()=>{
        PollEmailVerificationStatus()
    }, [])
   
const  Resend = async()=>{
    try{
        await accountStore.Resend_ConfirmationEmail()
        setContext("The email is resent! Please check your email")
    }
    catch(error){
        setContext("Error is appeared!")
        console.log(error)
    }
}
    return (
        <div className="  h-full flex justify-center items-center "  >
            <div className='w-[350px]'>
                    <div className="flex flex-col gap-4">
                        {/* <LoginIcons /> */}
                        <div className="flex flex-col gap-2">

                            <span className="text-[16px] font-medium text-[#000000]">
                                {context}
                            </span>
                            <span className="text-[13px] text-[#000000]">
                                Please click the confirmation link we sent to {User?.email}.
                                <span className="text-[13px] text-[#34a4eb] cursor-pointer " onClick={Resend}>&nbsp;Resend the confirmation link.</span>
                            </span>

                        </div>
                        



                        {/* <LoginButton isSubmit={true} title={"Send"} /> */}
                        <LoginSecondaryButton title="back" handleClick={()=>{
                            navigate('/register')
                            accountStore.Logout();
                        }}/>
       
                    </div>
            </div>


        </div>
    )
}

