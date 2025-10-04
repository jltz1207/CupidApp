import React from 'react'
import { store } from '../../../../store/Store'
import { observer } from 'mobx-react-lite'

interface Prop {
    imgSrc?: string
    width?:number
    height?:number
}
export default observer(function ProfileImage({ imgSrc, width, height }: Prop) {
    const { User } = store.accountStore
    const imgWidth = width || 40;  // Default width is 40px if not provided
    const imgHeight = height || 40;  // Default height is 40px if not provided
    return (
        <div>
            {imgSrc ?
                <img style={{ width: `${imgWidth}px`, height: `${imgHeight}px` }} className="rounded-full" src={imgSrc} alt="Profile" />
                : User && User.iconSrc ?
                    <img style={{ width: `${imgWidth}px`, height: `${imgHeight}px` }} className="rounded-full" src={User.iconSrc} alt="Profile" />
                    : <img style={{ width: `${imgWidth}px`, height: `${imgHeight}px` }} className="rounded-full" src="/asset/profile/blankProfile.png" alt="Profile" />
            }
        </div>
    )
})
