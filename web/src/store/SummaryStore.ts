import { makeAutoObservable, reaction } from "mobx";
import { BrowserRouter, useNavigation } from "react-router-dom";
import agent from "../Api/agent";
import { error } from 'console';
import { Id_Name } from "../Model/Id_Name";
export default class SummaryStore {
    Interest_Tags: Id_Name[] = []
    AboutMe_Tags: Id_Name[] = []
    Value_Tags: Id_Name[] = []
    PageId: Number = -1 
    
    isRateOpen:boolean=false
    RateCategory:number = -1
    RateDetails:string =""
    FinalRateOpen:boolean = true

    constructor() {
        makeAutoObservable(this);
    }
    setFinalRate = ()=>{
        this.FinalRateOpen = !this.FinalRateOpen
    }
    setPageId = (n:Number)=>{
        this.PageId = n
    }
    getInterestList = async () => {
        try {
            const res = (await agent.Summary.getInterestList()).data
            console.log(res)
            this.Interest_Tags = res
            console.log(this.Interest_Tags)
            return res;
        }
        catch (error) {
            console.log(error)
        }
    }

    getValueList = async () => {
        try {
            const res = (await agent.Summary.getValueList()).data
            console.log(res)
            this.Value_Tags = res
            console.log(this.Value_Tags)
            return res;
        }
        catch (error) {
            console.log(error)
        }
    }

    getAboutMeList = async () => {
        try {
            const res = (await agent.Summary.getAboutMeList()).data
            console.log(res)
            this.AboutMe_Tags = res
            console.log(this.AboutMe_Tags)
            return res;
        }
        catch (error) {
            console.log(error)
        }
    }


    getHKTime = () => {
        var now = new Date();

        var time = now.getTime();

        var timezoneOffset = now.getTimezoneOffset() * 60000;

        var utcTime = time + timezoneOffset;

        var hongKongOffset = 8 * 60 * 60 * 1000;

        var hktTime = new Date(utcTime + hongKongOffset);

        return hktTime;

    }

    scrollToBottom = (elementId: string) => {
        var element = document.getElementById(elementId);
        if (element === null) { return; }
        element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    }

    covertUrlToFile = async(imageUrl:string) => {
        try {
            
            const response = await fetch(imageUrl)
            const blob = await response.blob();
            const filename = imageUrl.split('/').pop() || 'downloaded.jpg';
            const file = new File([blob], filename, { type: blob.type });
            return file
          } catch (error) {
            console.error('Error converting image to file:', error);
          }
    }
    RateFunction = async(record:any)=>{
        try{
            if(this.RateCategory == -1 || this.isRateOpen == false)
                return
             await agent.Summary.RateFunction({...record,rateCategoryId:this.RateCategory });
            return 
        }
        catch(error){
            console.log(error)
        }
    }
 
    
    setRateOpen=(num:number,details?:string)=>{
        this.RateDetails =details==null?"":details
        this.isRateOpen = true
        this.RateCategory = num
    }

    setRateClose=()=>{
        this.isRateOpen = false
        this.RateCategory =-1
    }
    
    sleep = async(ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
      };
}