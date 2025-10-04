import React from 'react'
import { NavElementProp } from './NavBar'
import { useNavigate } from 'react-router-dom'

interface Prop {
  src: string
  link: string
  selected: boolean
  setSelectedIdx:(no:number) =>void
  idx:number
}
export default function NavElement({ idx, src, link, selected, setSelectedIdx }: Prop) {
  const navigate = useNavigate();

  return (
    <div  className="w-full flex justify-center hover:bg-[#111111] py-3"  onClick={() => { navigate(link); setSelectedIdx(idx) }}>
      {selected ? <img src={`/asset/nav/selected/${src}.png`} className="w-12" />
        : <img src={`/asset/nav/${src}.png`} className="w-12" />}
    </div>
  )
}
