import React, { ChangeEvent, useEffect, useState } from 'react'
import ProfileCrop from '../../crop/ProfileCrop';

interface Prop<T> {
    setFile: (file?:File) => void
    file?: (File)

}



export default function SingleImageUpload<T extends {}>({   setFile, file }: Prop<T>) {

    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
    const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (file != undefined ) {
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log(e.target?.result as string)
                setPreviewUrl(e.target?.result as string);
            };

            reader.readAsDataURL(file as File);
        }
    }, [file]);


    const setFile_final = (newFile: File) => {
       
        setFile(newFile)
    }

    const setFile_handleDelete =()=>{
        
        setFile(undefined)
        setPreviewUrl(undefined)
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files != null && event.target.files[0] != null) {
            const newFile = event.target.files[0]
            // convert file to  url for cropping
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log(e.target!.result as string)
                setImgSrc(e.target!.result as string)
            };
            reader.readAsDataURL(newFile);
        }



    }

    const [showCross, setShowCross] = useState<boolean>(false)

 
    return (
        <div  className="rounded-lg w-[400px] h-[400px] bg-[#cfd2d4] flex items-center justify-center relative" onClick={() => console.log(previewUrl)}>

            <div className="w-8 h-8 absolute  top-1 right-1" onMouseEnter={() => { setShowCross(true) }} onMouseLeave={() => { setShowCross(false) }}>
                {file &&showCross && 
                    <img onClick={setFile_handleDelete}  src="/asset/button/general/cross2.png" className="absolute w-full " />
                }
            </div>

            <ProfileCrop setFile={setFile_final} imgSrc={imgSrc} setPreviewUrl={setPreviewUrl} setImgSrc={setImgSrc} />

            <label className="h-full w-full flex items-center justify-center">
                {previewUrl !== undefined ?
                    <img className="rounded-lg h-full w-full" src={previewUrl} />
                    :
                    <img src="/asset/profile/profileUpload.png" className="w-32" />}
                <input className="hidden" id="123" name={""} type='file' onChange={handleFileChange} />

            </label>


        </div>
    )
}
