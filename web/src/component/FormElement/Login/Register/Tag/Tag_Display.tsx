import React, { useState } from 'react'
import { Id_Name } from '../../../../../Model/Id_Name'

interface Prop {
    data: string
}
export default function Tag_Display({ data}: Prop) {




    return (

        <div className={`border-2 border-tag-red rounded-lg flex items-center justify-center whitespace-nowrap px-2 py-1`}>
            <span>{data} </span>
        </div>
    )

}
