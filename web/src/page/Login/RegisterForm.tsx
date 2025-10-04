import React, { useState } from 'react'
import { LoginInput } from '../../component/FormElement/Login/LoginInput'
import LoginButton from '../../component/FormElement/Login/LoginButton'
import LoginSplit from '../../component/FormElement/Login/LoginSplit'
import GoogleLoginButton from '../../component/button/GoogleLoginButton'
import { Link, useNavigate } from 'react-router-dom'
import { RegisterModel } from '../../Model/User'
import { useStore } from '../../store/Store'
import ErrorMessage from '../../component/Error/ErrorMessage'

export default function RegisterForm() {
  const navigate = useNavigate();
  const store = useStore();
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [regObj, setRegObj] = useState<RegisterModel>({
    email: '',
    password: '',
    rePassword: ''

  });


  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(regObj)
    store.accountStore.Register_ValidateEmail(regObj).then((res) => {
      navigate("/checkEmail")
    })
      .catch(error => {
        console.log(error)
        if (error.response != null && error.response.data != null) {
          setErrorMsg(error.response.data)

        }
      }

      )

  }
  return (
    <div className=" h-full flex justify-center items-center "  >
      <div className='w-[350px]'>
        <form onSubmit={onSubmit} autoComplete="off" >
          <div className="flex flex-col gap-4">
            {/* <LoginIcons /> */}
            <div className="flex justify-center">
              <GoogleLoginButton />
            </div>
            <LoginSplit />
            <LoginInput title={"Email Address"} name={"email"} value={regObj.email} record={regObj} setRecord={setRegObj} />
            <LoginInput title={"Password"} name={"password"} value={regObj.password} record={regObj} setRecord={setRegObj} isPassword={true} />
            <LoginInput title={"reEnter-Password"} name={"rePassword"} value={regObj.rePassword} record={regObj} setRecord={setRegObj} isPassword={true} />

            <div className="flex justify-between items-center">


            </div>
            <LoginButton isSubmit={true} title={"Register"} />

            <ErrorMessage message={errorMsg} />


          </div>
        </form>

        <div className="border-2 border-[#dbdbdb] flex mt-10 h-[50px] items-center justify-center  ">
          <span className="text-[13px] text-[#111111]">You have an account?</span>
          <Link to="/" className="flex items-center">
            <span className="text-[13px] text-[#315272]">&nbsp;Login</span>
          </Link>
        </div>
      </div>

    </div>
  )
}
