import React from 'react'
import RegisterHeading from '../../../../component/FormElement/Login/Register/RegisterHeading'
import { Id_Name } from '../../../../Model/Id_Name'
import Tag from '../../../../component/FormElement/Login/Register/Tag/Tag'
import { AccountForm } from '../../../../Model/Account'

interface Prop {
    tags:Id_Name[]
    clickedIds:number[]
    title: string
    description: string
    handleClick:(n:number)=>void
    error?: string;

}
export default function TagContainer(p: Prop) {

    return (
        <div className=' border-[#ACACAC] border-2 p-8  flex flex-col gap-3'>
            <RegisterHeading title={p.title} content={p.description} />
            <div className="tag-container">
            {p.tags.map((item, idx) => (
                <Tag clicked={p.clickedIds.includes(item.id)} data={item} handleClick={() => { p.handleClick(item.id) }} />

                ))}
            </div>
            {   p.error && <p className="msg-warning">{p.error}</p>}

        </div>
    )
}
