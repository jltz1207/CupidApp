import axios, { AxiosResponse } from "axios";
import { store } from "../store/Store";
import { EmailConfirmModel, LoginModel, ProfileModel, RegisterModel, UserDto } from "../Model/User";
import { Id_Name } from "../Model/Id_Name";
import { UserDto_Detailed } from "../Model/Discover";
import { ChatroomDto } from "../Model/Chatroom";
import { GptMessage } from "../Model/Gpt";
import { AiGenForm } from './../Model/AiGen';
import { ReportUserForm } from "../Model/Report";
import { AccountForm } from "../Model/Account";
import { FileData } from "../store/AccountStore";

axios.defaults.baseURL = 'https://localhost:7053/api';
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Axios request config:', config);
    return config;
})
const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: any) => axios.post<T>(url, body).then(responseBody),
    //wrong post_2: <T>(url: string, body1: any, body2: any) => axios.post<T>(url, { ...body1, ...body2 }).then(responseBody),
    put: <T>(url: string, body: any) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}
const Summary = {
    getInterestList:() => axios.get<Id_Name[]>('/summary/getInterestList'),
    getValueList:() => axios.get<Id_Name[]>('/summary/getValueList'),
    getAboutMeList:() => axios.get<Id_Name[]>('/summary/getAboutMeList'),
    RateFunction:(form:any) => axios.post<any>('/summary/RateFunction',form),

}
const Discover = {
    getRandomMatches:() => axios.get<UserDto_Detailed[]>('/discover/getRandomMatches'),
    handleLike:(likedUserId:string)=>axios.post<{isMatch:boolean,roomId:string | undefined }>(`/discover/handleLike?likedUserId=${likedUserId}`),
    genFaceMatch:(model: FormData) => axios.post<UserDto_Detailed>('/discover/genFaceMatch',model),

}

const Match = {
    GetChatRoomDetails:() => axios.get<ChatroomDto[]>('/match/GetChatRoomDetails'),
    genAiResponse:(form:AiGenForm)=> axios.post<string>('/match/genAiResponse',form),
}
const Account = {
    editAccountForm:(model: FormData) => axios.post<void>('/account/EditAccountForm', model),
    getAccountFormProfile:() => axios.get<FileData[]>('/account/getAccountFormProfile'),
    getUser:() => axios.get<UserDto>('/account/user'),
    Login_Google: (cred: string) => axios.post<UserDto>(`/account/Login_Google?cred=${cred}`),
    Login_Normal: (model: LoginModel) => axios.post<UserDto>(`/account/Login_Normal`, model),
    Register_ValidateEmail: (model: RegisterModel) => requests.post<UserDto>(`/account/Register_ValidateEmail`, model),

    Submit_Profile: (model: FormData) => requests.post<void>(`/account/Submit_Profile`, model),
    ConfirmEmail: (userId: string, token: string) => axios.post<void>(`/account/confirmEmail?userId=${userId}&token=${token}`),
    ConfirmEmailStatus:(userId:string) => axios.post<boolean>(`/account/ConfirmEmailStatus?userId=${userId}`),
    Resend_ConfirmationEmail:() => axios.post<void>('/account/Resend_ConfirmationEmail'),
    getAccountForm:() => axios.get<AccountForm>('/account/getAccountForm')
}

const Gpt ={
    loadCupidMessages:()=> axios.get<GptMessage[]>('/Gpt/loadCupidMessages'),
    sendCupidMessage:(query:string)=>axios.post<GptMessage>(`/Gpt/sendCupidMessage?query=${query}`),
    loadAsistMessages:()=> axios.get<GptMessage[]>('/Gpt/loadAsistMessages'),
    sendAsistMessage:(query:string)=>axios.post<GptMessage>(`/Gpt/sendAsistMessage?query=${query}`),
    GenerateAiBio:(model:any) => axios.post<string>(`/Gpt/GenerateAiBio`, model),
    GenUpdateBio:(model:any) => axios.post<string>(`/Gpt/GenUpdateBio`, model),
}
const report = {
    getCategories:()=> axios.get<Id_Name[]>(`/Report/getCategories`),
    submitReport:(form:ReportUserForm)=> axios.post<void>(`/Report/submitReport`, form),

}

const agent = {
    Account,
    Summary,
    Discover,
    Match,
    Gpt,
    report
}
export default agent;