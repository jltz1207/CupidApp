import { GoogleLogin } from '@react-oauth/google'
import React from 'react'
import { useStore } from '../../store/Store';
import { UserDto, } from '../../Model/User';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

export default observer(function GoogleLoginButton() {
    const store = useStore();
    const { accountStore } = store
    const { User, setRegInfo } = accountStore;
    const navigate = useNavigate();
    const handleSuccess = async (res: any) => {
        console.log(res)
        await store.accountStore.Login_Google(res.credential)
            .then((user: UserDto) => {
                store.commonStore.setToken(user.token)
                if (user.profileFilled == true){
                    navigate("/home")
                }
                else{
                    setRegInfo(true)
                }           
           
        })
    }
    return (
        <div className="flex  ">
            <GoogleLogin
                onSuccess={(res) => handleSuccess(res)}

                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    )
})
