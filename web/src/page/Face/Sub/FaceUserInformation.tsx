import React from 'react'
import { UserDto_Detailed } from '../../../Model/Discover'
import Tag_Display from '../../../component/FormElement/Login/Register/Tag/Tag_Display'
import ImageScroller, { ImageProp } from '../../../component/Profile/ImageScroller'

interface Prop {
  user?: UserDto_Detailed
}

export default function FaceUserInformation({ user }: Prop) {
 
  const images: ImageProp[] | undefined = user!=undefined ? user.profileFiles.map((item, idx) => {
      return ({ src: item, isOpen: false })
  })
  : undefined


  if (user == undefined) {
    return null
  }
  return (
    <div className="w-[500px] h-full  drop-shadow-2xl border-2 border-[#c7c6c3] bg-[#FFFFFF] py-8 px-4">
        <div className="flex flex-col gap-2">

            <div className='pb-3 border-b-2 border-[#c7c6c3] flex flex-col gap-2'>
                {/* name */}
                <span className="text-[22px] font-bold">{user.name + ","}</span>
                <p className="text-[18px] ">
                    {user.age }
                </p>

                {/* bios */}
               {user.bio}

            </div >

            <div className="py-4 ">
                {/* interest */}
                <span className="text-[22px] font-bold">Interest</span>
                <div className='flex gap-1 flex-wrap '>
                    {user.interests.map((name, idx) => (
                        <Tag_Display data={name} key={idx} />
                    ))}
                </div>
            </div>

            <div className="py-4 ">
                {/* About Me */}
                <span className="text-[22px] font-bold">About Me</span>
                <div className='flex gap-1 flex-wrap'>
                    {user.aboutMes.map((name, idx) => (
                        <Tag_Display data={name} key={idx} />
                    ))}
                </div>
            </div>

            <div className="py-4 border-b-2 border-[#c7c6c3]">
                {/* My Value */}
                <span className="text-[22px] font-bold">My Value</span>
                <div className='flex gap-1 flex-wrap'>
                    {user.values.map((name, idx) => (
                        <Tag_Display data={name} key={idx} />
                    ))}
                </div>
            </div>
            <ImageScroller title="More Photos" imageList={images} />

        </div>
    

</div>
  )
}
