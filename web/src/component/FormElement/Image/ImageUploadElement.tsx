import React, { ChangeEvent, useEffect, useState } from 'react'
import ProfileCrop from '../../crop/ProfileCrop';

interface Prop<T> {
    idx: number
    setFiles: (file: (File|undefined)[]) => void
    files: (File|undefined)[]

}



export default function ImageUploadElement<T extends {}>({  idx, setFiles, files }: Prop<T>) {

    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
    const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (files != undefined && files[idx] != undefined) {
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log(e.target?.result as string)
                setPreviewUrl(e.target?.result as string);
            };

            reader.readAsDataURL(files[idx] as File);
        }
    }, [files]);


    const setFile_final = (newFile: File) => {
        const updatedFiles = [...files];
        updatedFiles[idx] = newFile
        setFiles(updatedFiles)
    }

    const setFile_handleDelete =()=>{
        const updatedFiles = [...files];
        updatedFiles[idx] = undefined
        setFiles(updatedFiles)
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

    // preview url => display
    //setfilefinal =>real state 
    return (
        <div  className="rounded-lg w-[200px] h-[200px] bg-[#cfd2d4] flex items-center justify-center relative" onClick={() => console.log(previewUrl)}>

            <div className="w-8 h-8 absolute  top-1 right-1" onMouseEnter={() => { setShowCross(true) }} onMouseLeave={() => { setShowCross(false) }}>
                {files && files[idx] &&showCross && 
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
