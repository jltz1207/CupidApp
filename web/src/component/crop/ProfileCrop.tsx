import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { OVERLAY_STYLES } from '../../Model/CSS/Style'


interface Prop {
    imgSrc?: string
    setPreviewUrl: (str: string | undefined) => void
    setImgSrc: (str: string | undefined) => void
    setFile: (src: File) => void
}

export default function ProfileCrop({ setFile, imgSrc, setImgSrc, setPreviewUrl }: Prop) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>()

    const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => {
            image.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

        ctx?.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );
        const dataUriMatch = imageSrc.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        const mimeType = dataUriMatch && dataUriMatch[1] ? dataUriMatch[1] : 'image/jpeg';

        // Convert the canvas to a Blob
        return new Promise((resolve) => {
            canvas.toBlob(resolve, mimeType);
        });
    };

    const handleCrop = async () => {
        if (imgSrc === undefined) {
            return
        }
        console.log(imgSrc)
        const croppedImg = await getCroppedImg( //passing pixels and src, return Blob
            imgSrc,
            croppedAreaPixels
        );
        //Blob to File
        console.log(croppedImg)
        const mimeType = (croppedImg as Blob).type;

        const file = new File([croppedImg as Blob], "cropped_image." + mimeType.split('/')[1], { type: mimeType });

        setFile(file) // handle save

        setPreviewUrl(URL.createObjectURL(croppedImg as Blob))//show in input

        setImgSrc(undefined) //close window

    }

    const onCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {

        console.log(croppedArea, croppedAreaPixels)
        setCroppedAreaPixels(croppedAreaPixels)
    }
    // Adjust the styling here to ensure that controls are below the cropper
    const controlStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute', 
        bottom: '20px', 
        width: '100%', 
        zIndex: 100, 
    };
    if (!imgSrc) {
        return null
    }
    return ReactDOM.createPortal(
        <div style={OVERLAY_STYLES as React.CSSProperties} >
            <div className='z-10 fixed top-[50%] left-[50%] w-full h-full translate-y-[-50%] translate-x-[-50%]'>
                <div className="crop-container ">
                    <Cropper
                        image={imgSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />

                </div>
                <div style={controlStyles} >
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e: any) => {
                            setZoom(e.target.value)
                        }}
                        className="zoom-range"
                    />
                    <button onClick={handleCrop} className="text-[#FFFFFF]">Crop</button>

                </div>
            </div >

        </div >,
        document.body
    );


}
