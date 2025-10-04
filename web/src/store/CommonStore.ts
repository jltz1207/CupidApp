import { makeAutoObservable, reaction } from "mobx";
import { BrowserRouter, useNavigation } from "react-router-dom";
export default class CommonStore {
    token: string | null = localStorage.getItem('jwt')
    isAppLoaded: boolean = false
    navigate: Function | null = null
    showNavBar: boolean = false
    IsLoading:boolean = false

    constructor() {
        makeAutoObservable(this);

        reaction( //initialise wont activate
            () => this.token,// side effect, when token is updated will run this code
            token => {
                if (token) {// to update the local storage
                    localStorage.setItem('jwt', token)
                } else {
                    localStorage.removeItem('jwt');
                    if (this.navigate) {
                        this.navigate('/')
                    }
                    window.location.href = '/';
                }
            }
        )
    }
    setLoading = (b:boolean)=>{
        this.IsLoading = b
    }
    setToken = (_token: string | null) => {

        this.token = _token;
    }
    setAppLoad = () => {
        this.isAppLoaded = true
    }

    setNavigate = (navigateFunction: Function) => {
        this.navigate = navigateFunction;
    };

    setNavBar = ()=>{
        this.showNavBar = !this.showNavBar;
    }
}