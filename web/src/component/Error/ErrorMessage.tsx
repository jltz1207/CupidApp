import React from 'react'

interface Prop {
    message?: string
}

export default function ErrorMessage({ message }: Prop) {

    return (
        <div className="flex justify-center">
            <span className="whitespace-nowrap text-warn-red">
                {message}
            </span>
        </div>
    )
}
