import { observer } from "mobx-react-lite"

interface Prop {
    isOpened: boolean
    setOpen?: (b:boolean)=>void
    content:()=>JSX.Element
  }
export default observer(function InfoTemplate({content, isOpened, setOpen }: Prop) {
    const handleChildClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    };


    if (!isOpened)
        return null
    return (
        <div style={{zIndex:101}} className="blur-overlay " onClick={() => { if(setOpen)setOpen(false)}}>
            <div className="info-info-table  p-3 pb-8 flex flex-col gap-2" onClick={handleChildClick}>
              {content()}

            </div>
        </div>

    )
})
