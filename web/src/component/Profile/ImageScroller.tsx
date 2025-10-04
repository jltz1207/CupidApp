import { Splide, SplideSlide } from '@splidejs/react-splide';
import React from 'react'
import { store } from '../../store/Store';
import { observer } from 'mobx-react-lite';
import '@splidejs/react-splide/css';
import ImagePopUp from './ImagePopUp/ImagePopUp';
import { useState } from 'react';
import CustomSlide from './CustomSlide/CustomSlide';

export interface ImageProp {
    isOpen: boolean
    src: string
    handleClick?: () => void
}
interface Prop {
    imageList?: ImageProp[]
    title: string
}
export default observer(function ImageScroller({ title, imageList }: Prop) {

    return (
        <div className="flex flex-col gap-2">
            <span>
                {title}
            </span>

            <Splide
                options={{
                    //type: 'loop',
                    gap: '1rem',
                    pauseOnHover: false,
                    resetProgress: false,
                    arrows: true,
                    pagination: true,
                    perPage: 3, // Number of slides per page
                    // other options
                }}
            >
                {imageList === undefined && [1, 2, 3].map((item, idx) => (

                    <SplideSlide key={idx}>
                        <img src={"/asset/profile/blankProfile.png"} />
                    </SplideSlide>

                ))}

                {imageList != null && imageList.map((item, idx) => {
                    
                    return (
                        <CustomSlide idx={idx} src={item.src} />
                    )
                })}


            </Splide>

        </div>
    );

})
