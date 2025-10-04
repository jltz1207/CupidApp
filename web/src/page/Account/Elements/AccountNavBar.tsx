import React from 'react'
interface Prop {
  setPage: (n: number) => void
  page:number
}

export default function AccoutNavBar(p: Prop) {
  const navItems = [
    {
      name: "Profiles",
    },
    {
      name: "Tags",
    }
    ,
    {
      name: "Weightning",
    }
    ,
    {
      name: "Login Info",
    }
  ]

  return (
    <div className="w-[300px] flex flex-col py-12 px-2 gap-4  ">
      {navItems.map((item, i) => {

        return (
        <div className={`p-3 text-[22px] ${p.page === i ?"bg-[#f0f4fe] text-[#316aff]":""}`} onClick={()=>p.setPage(i)}>
          {item.name}
        </div>)
      })}
    </div>
  )
}
