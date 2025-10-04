export interface AccountForm {
    id: string
    name: string
    dateOfBirth: string
    gender?: boolean
    
    showMe: number
    showMeMinAge?:number
    showMeMaxAge?:number

    currentProfileFiles: (File|undefined)[]
    newProfileFiles: (File|undefined)[]
    
    interestIds: number[]
    aboutMeIds: number[]
    valueIds: number[]
    bio: string
    email?: string 
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string

    keywordWeight:number
    interestWeight:number
    aboutMeWeight:number
    valueWeight:number
    ageWeight:number
    
}



export class AccountFormValue implements AccountForm {
    id: string = ""
    name: string = ""
    dateOfBirth: string = ""
    gender?: boolean
    showMe: number = -1
    
    showMeMinAge?:number  
    showMeMaxAge?:number
    
    currentProfileFiles: File[] = []
    newProfileFiles: File[] = []

    interestIds: number[] = []
    aboutMeIds: number[] = []
    valueIds: number[] = []
    bio: string = ""
    
    keywordWeight:number = -1 //default
    interestWeight:number = -1
    aboutMeWeight:number = -1
    valueWeight:number = -1
    ageWeight:number = -1

    constructor(init?: AccountForm) {
        // if (init && init.date) {
        //   init.time = init.date;
        // }
        Object.assign(this, init);
    }
}

export interface IAccountFormError{
    name: string
    dateOfBirth: string
    newProfileFiles: string
    interestIds: string
    aboutMeIds: string
    valueIds: string
    bio: string
    email: string

    oldPassword: string

    newPassword: string
    confirmPassword: string

    keywordWeight:string 
    interestWeight:string 
    aboutMeWeight:string 
    valueWeight:string 
    ageWeight:string 

}
export class AccountFormErrorValue implements IAccountFormError {
    name: string = ""
    dateOfBirth: string = ""

    newProfileFiles:string = ""

    interestIds:string = ""
    aboutMeIds:string = ""
    valueIds: string = ""
    bio: string = ""

    email:string =""
    oldPassword:string =""
    newPassword:string =""
    confirmPassword:string =""

    keywordWeight:string = ""//default
    interestWeight:string =""
    aboutMeWeight:string =""
    valueWeight:string =""
    ageWeight:string =""

}
export class BioForm{
    lookingFor:string =""
    otherDetails:string =""
}