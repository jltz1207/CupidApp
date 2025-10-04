import React from 'react'
import Star from './Star'
interface Prop{
  setRecord:any
  record:any
}
export default function StarComponents({record,setRecord}:Prop) {
  
  const setValue =(idx:number)=>{
    setRecord({...record, marks:idx})
  }
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((item,i)=>(
        <Star record={record} idx={item} setValue={setValue}/>
      ))}
    </div>
  )
}
