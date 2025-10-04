import { observer } from 'mobx-react-lite'
import React from 'react'
import { ReportUserForm } from '../../../Model/Report'
import { store } from '../../../store/Store'
import { TextAreaElement } from '../../../component/FormElement/TextAreaElement'
import LoginButton from '../../../component/FormElement/Login/LoginButton'

interface Prop {
    record: ReportUserForm
    setRecord: React.Dispatch<React.SetStateAction<ReportUserForm>>
    setPage: (n: number) => void

}
export default observer(function ReportSubmitForm({ record, setRecord }: Prop) {
    const reportStore = store.reportStore

    const handleSubmit = () => {
        reportStore.submitReport(record)
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-center border-b-2 border-[#C7C6C3] p-1 ">
                <span className="">Categories: {reportStore.findName(record.categoryId)}</span>
            </div>
            <TextAreaElement title="Description (Optional):" name="description" isRequired={false} setRecord={setRecord} record={record} />
            <LoginButton title={'Submit'} handleClick={handleSubmit} />
        </div>
    )
})
