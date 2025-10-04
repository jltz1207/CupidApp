import { makeAutoObservable } from "mobx";
import agent from "../Api/agent";
import { store, useStore } from "./Store";
import { EmailConfirmModel, LoginModel, ProfileModel, RegisterModel, UserDto } from "../Model/User";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { error } from "console";
import { AccountForm } from "../Model/Account";
export interface FileData {
    fileName: string;
    content: string;  // Base64 encoded string of the file
    type: string;     // MIME type of the file
}

export default class AccountStore {

    LoadingInitial: boolean = false
    User: UserDto | null = null
    isRegInfoOpen: boolean = false
    constructor() {
        makeAutoObservable(this);
    }
    base64ToBlob(base64: string, type: string = 'application/octet-stream'): Blob {
        const binaryString: string = window.atob(base64);  // Decode base64
        const len: number = binaryString.length;
        const bytes: Uint8Array = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return new Blob([bytes.buffer], { type: type });
    }
    getAccountFormProfile = async () => {
        try {
            const response = await agent.Account.getAccountFormProfile()
            const filesData: FileData[] = await response.data;

            const files: File[] = await Promise.all(filesData.map(async (fileData): Promise<File> => {
                const blob: Blob = this.base64ToBlob(fileData.content, fileData.type);
                return new File([blob], fileData.fileName, { type: fileData.type });
            }));

            console.log(files);
            return files;
        } catch (error) {
            console.error('Error downloading file:', error);
            return []; // Return an empty array or throw an error, depending on your requirements
        }
    };
    getUser = async () => {
        try {
            const response = await agent.Account.getUser();
            console.log(response.data)
            this.User = response.data;
            console.log(response.data)
            return response.data
        }
        catch (error) {
            throw error
        }
    }
    Login_Google = async (cred: string) => {

        try {
            this.LoadingInitial = true
            var user = await agent.Account.Login_Google(cred);
            this.User = user.data;
            console.log(user.data)
            this.LoadingInitial = false

            return user.data;
        }
        catch (error) {
            this.LoadingInitial = false
            throw error;
        }
    }

    Login_Normal = async (model: LoginModel) => {
        try {
            this.LoadingInitial = true
            var user = await agent.Account.Login_Normal(model)
            this.User = user.data;
            console.log(user.data)



            this.LoadingInitial = false
            return this.User;
        }
        catch (error) {
            this.LoadingInitial = false
            throw error;
        }
    }

    Register_ValidateEmail = async (model: RegisterModel) => {
        try {
            this.LoadingInitial = true
            const user = await agent.Account.Register_ValidateEmail(model);
            this.User = user;
            this.LoadingInitial = false

        }
        catch (error) {
            this.LoadingInitial = false
            throw error
        }
    }

    CheckEmailConfirmed = (is: boolean) => {
        const navigate = useNavigate() // may violate rules of using hook
        if (is == false) {
            navigate("/")
        }
    }

    setRegInfo = (b: boolean) => {
        this.isRegInfoOpen = b;
    }

    Submit_Profile = async (model: ProfileModel) => {
        try {
            console.log(model)
            const formData = new FormData();

            for (const key in model) {
                const data = (model as Record<string, any>)[key]

                if (Array.isArray(data) && data[0] instanceof File) {

                    data.forEach((item, idx) => {
                        formData.append(key, item)
                    })

                }
                else if (Array.isArray(data) && data[0] instanceof Number) {
                    formData.append(key, JSON.stringify(data))
                }
                else {
                    formData.append(key, data)
                }

            }


            const result = await agent.Account.Submit_Profile(formData);
            return
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }



    ConfirmEmail = async (userId: string, token: string) => {
        try {
            var res = await agent.Account.ConfirmEmail(userId, token);
            return;
        } catch (error) {
            throw error
        }
    }

    PollEmailVerificationStatus = async () => {
        const interval = setInterval(async () => {
            try {
                console.log(this.User)
                const rep = await agent.Account.ConfirmEmailStatus(this.User?.id || "")
                if (rep.data) {
                    clearInterval(interval); // Stop polling
                    console.log("success", this.User)
                    this.setRegInfo(true);
                }
            }
            catch (error) {
                console.log(error)
            }
        }, 5000)
    }


    Logout = () => {
        store.commonStore.setToken(null)
        this.User = null
    }

    Resend_ConfirmationEmail = () => {
        try {
            agent.Account.Resend_ConfirmationEmail()
            return 0
        }
        catch (error) {
            throw error;
        }
    }
    dateToString = (str: string) => {
        return str.split('T')[0]
    }
    getAccountForm = async () => {
        try {
            const result = await agent.Account.getAccountForm();

            return { ...result.data, dateOfBirth: this.dateToString(result.data.dateOfBirth) }
        }
        catch (error) {
            throw error
        }
    }

    editAccountForm = async (model:AccountForm) => {
        try {
            console.log(model)
            const formData = new FormData();

            for (const key in model) {
                const data = (model as Record<string, any>)[key]
                if (data === undefined || data === null) {
                    // If you need to keep track of these values, convert them to a specific string
                    // Or consider not appending them if the server handles missing fields appropriately
                }
                else if (Array.isArray(data) && data[0] instanceof File) {

                    data.forEach((item, idx) => {
                        formData.append(key, item)
                    })
                }
                else if (Array.isArray(data) && data[0] instanceof Number) {
                    formData.append(key, JSON.stringify(data))
                }
                else {
                    formData.append(key, data)
                }

            }

            const result = await agent.Account.editAccountForm(formData);
            return;
        }
        catch(error){
            throw error
        }
    }

}