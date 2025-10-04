import React, { useEffect, useState } from 'react'
import GoogleLoginButton from '../../component/button/GoogleLoginButton'
import { gapi } from 'gapi-script'
import { LoginInput } from '../../component/FormElement/Login/LoginInput'
import LoginCheckbox from '../../component/FormElement/Login/LoginCheckbox'
import { Link, useNavigate } from 'react-router-dom'
import LoginButton from '../../component/FormElement/Login/LoginButton'
import LoginSplit from '../../component/FormElement/Login/LoginSplit'
import { LoginModel } from '../../Model/User'
import { useStore } from '../../store/Store'
import ErrorMessage from '../../component/Error/ErrorMessage'
import { AxiosResponse } from 'axios';

export default function LoginForm() {
    const navigate = useNavigate();
    const store = useStore();
    const [errorMsg, setErrorMsg] = useState<string>("")
    const [loginObj, setLoginObj] = useState<LoginModel>({
        email: '',
        password: '',
        rememberMe: false

    })

    const showRecord = () => {
        console.log(loginObj)
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await store.accountStore.Login_Normal(loginObj).then((i) => {
            if (i.token) {
                store.commonStore.setToken(i.token)
            }
            if (!i.emailConfirmed) {
                navigate("/checkEmail")
              }
              else if (!i.profileFilled) {
                store.accountStore.setRegInfo(true)
              }
              else{
                navigate("/home")
              }
        }
        )
        .catch(error => {
            console.log(error)
            setErrorMsg(error.response.data)
        })

    }

    return (
        <div className=" h-full flex justify-center items-center "  >
            <div className='w-[350px]'>
                <form onSubmit={onSubmit} autoComplete="off" >
                    <div className="flex flex-col gap-4">
                        {/* <LoginIcons /> */}
                        <span className="font-medium" onClick={showRecord} >
                            Welcome back, good to see you again
                        </span>

                        <LoginInput title={"Email Address"} name={"email"} value={loginObj.email} record={loginObj} setRecord={setLoginObj} />
                        <LoginInput title={"Password"} name={"password"} value={loginObj.password} record={loginObj} setRecord={setLoginObj} isPassword={true} />

                        <div className="flex justify-between items-center">
                            <LoginCheckbox title={"Remember me"} record={loginObj} name="rememberMe" value={loginObj.rememberMe} setRecord={setLoginObj} />

                            <Link to={"/loginPage/forget-password"}>
                                <span className="text-[13px] text-[#116DAA]">
                                    Forgot your password?
                                </span>
                            </Link>
                        </div>
                        <LoginButton isSubmit={true} title={"Log In"} />
                        <ErrorMessage message={errorMsg} />
                        <LoginSplit />

                        <div className="flex justify-center">
                            <GoogleLoginButton />
                        </div>
                    </div>
                </form>

                <div className="border-2 border-[#dbdbdb] flex mt-10 h-[50px] items-center justify-center  ">
                    <span className="text-[13px] text-[#111111]">Don't have an account?</span>
                    <Link to="/register" className="flex items-center">
                        <span className="text-[13px] text-[#315272]">&nbsp;register</span>
                    </Link>
                </div>
            </div>



        </div>


    )
}
