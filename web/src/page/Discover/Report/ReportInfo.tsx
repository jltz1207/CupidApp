import React, { useEffect, useState } from 'react'
import { Id_Name } from './../../../Model/Id_Name';
import { store } from '../../../store/Store';
import ReportCategoriesTable from './ReportCategoriesTable';
import { ReportUserForm } from '../../../Model/Report';
import { observer } from 'mobx-react-lite';
import ReportSubmitForm from './ReportSubmitForm';
interface Prop {
    isOpened: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default observer(function ReportInfo({ isOpened, setOpen }: Prop) {
    const [page, setPage] = useState<number>(0)
    const reportStore = store.reportStore;
    const handleChildClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    };
    const [record, setRecord] = useState<ReportUserForm>(
        {
            toUserId:'' ,
            categoryId:-1,
        });

    if (!isOpened)
        return null
    return (
        <div className=" blur-overlay " onClick={() => { setOpen(false);setPage(0) }}>
            <div className="info-info-table  p-3 pb-8 flex flex-col gap-2" onClick={handleChildClick}>
               {page == 0 &&  <ReportCategoriesTable setRecord={setRecord} setPage={setPage}/>}
               {page == 1 &&  <ReportSubmitForm setRecord={setRecord} record={record} setPage={setPage}/>}

            </div>
        </div>

    )
})
