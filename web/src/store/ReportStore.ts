import { makeAutoObservable, reaction } from "mobx";
import agent from "../Api/agent";
import { Id_Name } from "../Model/Id_Name";
import { ReportUserForm } from './../Model/Report';
import { store } from "./Store";

export default class ReportStore {
    Categories: Id_Name[] = []
    constructor() {
        makeAutoObservable(this);
    }
    getCategories = async () => {
        try {
            const res = await agent.report.getCategories();
            this.Categories = res.data
        }
        catch (error) {
            throw error
        }
    }


    findName = (id:number)=>{
        if(this.Categories == undefined || this.Categories.length==0){
            return "NULL"
        }
        for(let cat of this.Categories){
            if(cat.id ==id ){
                return cat.name
            }
        }
        return "NULL"
    }   

    submitReport = (form: ReportUserForm)=>{
        try{
            agent.report.submitReport({...form, toUserId:store.discoverStore.getCurrentUserId()});
        }
        catch(error){
            throw error
        }
    }
}