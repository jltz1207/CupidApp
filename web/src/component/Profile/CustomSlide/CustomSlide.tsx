import { SplideSlide } from '@splidejs/react-splide';
import React, { useState } from 'react'
import ImagePopUp from '../ImagePopUp/ImagePopUp';

interface Prop {
    idx: number
    src: string
}
export default function CustomSlide({ src, idx }: Prop) {
    const [state, setState] = useState<boolean>(false)
    return (
        <>
            <ImagePopUp src={src} isOpen={state} setOpen={setState} />

            <SplideSlide key={idx}>
                <img onClick={() => { setState(true) }} src={src} />
            </SplideSlide>
        </>

    )
}
