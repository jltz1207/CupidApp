import React from 'react'
import { store } from '../../store/Store'
import Tag_Display from '../FormElement/Login/Register/Tag/Tag_Display';
import { observer } from 'mobx-react-lite';
import ImageScroller, { ImageProp } from './ImageScroller';
export default observer(function ProfileDetails() {

    const { Current_OtherUsers, UserIdx } = store.discoverStore;

    const images: ImageProp[] | undefined = (Current_OtherUsers != null && Current_OtherUsers[UserIdx] != null) ?
        Current_OtherUsers[UserIdx].profileFiles.map((item, idx) => {
            return ({ src: item, isOpen: false })
        })
        : undefined

    return (
        <div className="w-[500px] h-full  drop-shadow-2xl border-2 border-[#c7c6c3] bg-[#FFFFFF] py-8 px-4">
            {(Current_OtherUsers != null && Current_OtherUsers[UserIdx] != null) &&
                <div className="flex flex-col gap-2">

                    <div className='pb-3 border-b-2 border-[#c7c6c3] flex flex-col gap-2'>
                        {/* name */}
                        <span className="text-[22px] font-bold">{Current_OtherUsers[UserIdx].name + ","}</span>
                        <p className="text-[18px] ">
                            {Current_OtherUsers[UserIdx].age }
                        </p>

                        {/* bios */}
                       {Current_OtherUsers[UserIdx].bio}

                    </div >

                    <div className="py-4 ">
                        {/* interest */}
                        <span className="text-[22px] font-bold">Interest</span>
                        <div className='flex gap-1 flex-wrap '>
                            {Current_OtherUsers[UserIdx].interests.map((name, idx) => (
                                <Tag_Display data={name} key={idx} />
                            ))}
                        </div>
                    </div>

                    <div className="py-4 ">
                        {/* About Me */}
                        <span className="text-[22px] font-bold">About Me</span>
                        <div className='flex gap-1 flex-wrap'>
                            {Current_OtherUsers[UserIdx].aboutMes.map((name, idx) => (
                                <Tag_Display data={name} key={idx} />
                            ))}
                        </div>
                    </div>

                    <div className="py-4 border-b-2 border-[#c7c6c3]">
                        {/* My Value */}
                        <span className="text-[22px] font-bold">My Value</span>
                        <div className='flex gap-1 flex-wrap'>
                            {Current_OtherUsers[UserIdx].values.map((name, idx) => (
                                <Tag_Display data={name} key={idx} />
                            ))}
                        </div>
                    </div>
                    <ImageScroller title="More Photos" imageList={images} />

                </div>
            }

        </div>
    )
})
