import React from 'react'
import ImageUploadElement from '../../../../../component/FormElement/Image/ImageUploadElement'
interface prop {
  setFiles: (file:  (File|undefined)[]) => void
  files:  (File|undefined)[]
  error?: string;
  handleValidation?: (field: string, value: any) => void
  reg?:boolean

}
export default function ImageUploadContainer({reg, handleValidation, error,setFiles, files }: prop) {


  const firstRow = [0, 1, 2].map((item, idx) => (
    <ImageUploadElement idx={item} setFiles={setFiles} files={files} />
  ))
  const secondRow = [3, 4, 5].map((item, idx) => (
    <ImageUploadElement  idx={item} setFiles={setFiles} files={files} />
  ))
  return (
    <div className={`flex flex-col gap-3 w-full ${reg?"items-center":""}`} >
      <div className="flex gap-3">
        {firstRow}
      </div>
      <div className="flex gap-3">
        {secondRow}
      </div>
      {error && <p className="msg-warning">{error}</p>}

    </div>
  )
}
