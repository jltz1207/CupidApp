import { ChangeEvent } from 'react'

interface Props<T> {
    height?: string
    title: string;
    name: string;
    isRequired: boolean;
    setRecord: (input: T) => void;
    record: T;
    error?: string;
    value?: string | number | readonly string[] | undefined
    readonly?: boolean;
    
}

export const TextAreaElement = <T extends {}>({readonly, height, value, name, title, isRequired, setRecord, record, error }: Props<T>) => {
    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setRecord({ ...record, [name]: value })
    }
    return (
        <div className="flex flex-col w-full">
            <div className="mb-2">
                <label className="">
                    <p className={`${isRequired ? "text-[#CC311B]" : ""}`}>
                        {isRequired && "*"}
                        {title}
                    </p>
                </label>
            </div>

            <div>
                <textarea value={value} readOnly={readonly} className={`w-full ${readonly ? "bg-[#D9D9D94D]" : ""} ${height ? height  : "h-[150px]"} border-2 rounded-lg border-[#ACACAC] px-3 py-2`} name={name} onChange={(e)=>handleChange(e)} />
                {error && <p>{error}</p>}
            </div>
            
        </div>
    )
}