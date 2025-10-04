import React from 'react'
import { useStore } from '../../../../store/Store';
import { observer } from 'mobx-react-lite';
interface Prop {

}
export default observer(function ProfileName() {
    const store = useStore();
    const { accountStore } = store;

    return (
    <div>
        <div className="flex gap-1 ">
            <span className="text-[12px]  ">{accountStore.User?.name}</span>
            <img className="w-[15px]" src={"asset/button/menu/downArrow.png"} />
        </div>
    </div>

    )
})
