import React, { useEffect, useState } from 'react'

interface Prop {
  idx: number
  setValue: (i: number) => void
  record:any
}
export default function Star({ record,idx, setValue }: Prop) {
  const [shown, setShown] = useState<boolean>(false)
  useEffect(()=>{
    setShown(record.marks>=idx)
  }, [record.marks])
  return (
    <div onClick={() => setValue(idx)}>
      {
        shown ?
          <img src="/asset/rate/starFilled.png" className="w-12" />
          : <img src="/asset/rate/star.png" className="w-12" />
      }
    </div>
  )
}
