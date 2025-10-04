import React from 'react'
import { ToolProp } from '../DiscoverDashBoard'
import ToolButton from '../../../component/button/ToolButton'
interface prop {
    tools: ToolProp[]
}
export default function ToolBar(p: prop) {
    return (
        <div className="relative flex gap-10">
            {p.tools.map((item, idx) => (
                <ToolButton key={idx} imgSrc={item.imgSrc} handleClick={item.handleClick} subDiv={item.subDiv} />
            ))}
        </div>
    )
}
