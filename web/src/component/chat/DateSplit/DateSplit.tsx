import React from 'react'
interface Prop {
    date: string
}
export default function DateSplit({ date }: Prop) {
  
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',      
        month: 'long',        
        day: '2-digit',
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(new Date(date));
  
    return (
        <div className="relative flex">
            <div className=" border-tag-grey border-b-2 flex-grow "></div>
            <span className="mx-3 text-tag-grey">{formattedDate}</span>
            <div className=" border-tag-grey border-b-2 flex-grow"></div>


        </div>

    )
}