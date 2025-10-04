import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/Store';

export default function ConfirmEmailPage() {
    const store = useStore();
    const{accountStore} = store
    const location = useLocation();
    const navigate = useNavigate();
    const getQueryParams = (query:any) => {
        return new URLSearchParams(query);
      };
      const queryParams = getQueryParams(location.search);

      // Get the userId and token from the URL
      const userId = queryParams.get('userId');
      const tokenDraft =  queryParams.get('token') ; 
      const token = encodeURIComponent(tokenDraft || "")
      
      useEffect(()=>{
        if(userId!=null && token != null && token!= ""){
            console.log(userId, token)
            accountStore.ConfirmEmail(userId, token).then((res =>{
                //navigate('/home')
            }))
        }
      }, [token, userId])

    return (
    <div className=" h-full flex justify-center items-center ">
        <span>The Confirmation is processing... </span>
    </div>
  )
}
