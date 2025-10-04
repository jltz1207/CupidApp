export interface UserDto {
    id: string
    token: string
    name: string
    email: string
    emailConfirmed: boolean
    profileFilled: boolean
    iconSrc?:string
    roomIds:string[];
}


export interface RegisterModel {
    email: string
    password: string
    rePassword: string
}

export interface ProfileModel {
    id: string
    name: string
    dateOfBirth: string
    gender?: boolean
    showMe: number
    profileFiles:  (File|undefined)[]

    interestIds: number[]
    aboutMeIds: number[]
    valueIds: number[]
    bio:string
    
    lookingFor:string
    otherDetails:string

    showMeMinAge:number
    showMeMaxAge:number

    keywordWeight:number
    interestWeight:number
    aboutMeWeight:number
    valueWeight:number
    ageWeight:number
}





export interface LoginModel {
    email: string
    password: string
    rememberMe: boolean
}

export interface EmailConfirmModel {
    id: string
    token: string
}
