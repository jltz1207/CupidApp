import React, { useEffect, useState } from 'react'
import { store } from '../../../store/Store';
import { Id_Name } from '../../../Model/Id_Name';
import { observer } from 'mobx-react-lite';
import { ReportUserForm } from '../../../Model/Report';


interface Prop{
    setRecord:React.Dispatch<React.SetStateAction<ReportUserForm>>
    setPage:(n:number)=>void
}
export default observer(function ReportCategoriesTable({setRecord, setPage}:Prop) {
    const reportStore = store.reportStore;
    const { Categories } = reportStore
    useEffect(() => {
        reportStore.getCategories();
    }, [reportStore])
    const handleNext=(catId:number)=>{
        setRecord(prev=>{
            return {...prev,categoryId:catId} 
        })
        setPage(1)
    } 
    return (
        <div>
            <div className="flex justify-center border-b-2 border-[#C7C6C3] p-1 ">
                <span className="">Report</span>
            </div>
            {Categories && Categories.map((item, i) => (
                <div className="border-b-2 border-[#C7C6C3] p-2 cursor-pointer  flex justify-between" onClick={()=>{handleNext(item.id)}}>
                    <span>{item.name}</span>
                    <img className="w-6" src="/asset/report/arrow.png" />
                </div>
            ))}
        </div>
    )
})
