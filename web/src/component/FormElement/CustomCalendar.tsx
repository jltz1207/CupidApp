import { ChangeEvent } from "react";
const errorMsg = {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '-2px'
}
interface DateInputProps<T> {
    width?: string
    name: string;
    title?: string;
    isRequired?: boolean
    setRecord: (input: T) => void;
    record: T;
    backgroundColor?: string
    type?: 'text' | 'date' | 'datetime-local';
    error?: string;
    textColor?: string;
    className?: string;
    value?: string | number | readonly string[] | undefined;
    handleValidation?: (field: string, value: any) => void

}

export const CustomCalendar = <T extends {}>({handleValidation,  width, value, className, textColor, error, name, record, setRecord, title, isRequired, backgroundColor, type }: DateInputProps<T>) => {


    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        const newValue = event.target.value === '' ? undefined : event.target.value;
        if(handleValidation) handleValidation(name, value)
        setRecord({ ...record, [name]: newValue })
    }
    return (
        <div className={`${width ? width : "w-full"}  flex-col justify-between`}>

            <div className='mb-2'>

                <label >
                    <p className={`whitespace-nowrap ${isRequired ? "text-[#CC311B]" : ""}`}>
                        {title && isRequired && "*"}

                        {title}
                    </p>
                </label>
            </div>

            <div>
                <input
                    className={`w-full  border-2 rounded-lg border-[#ACACAC] px-4 py-1 ${backgroundColor ? "bg-" + backgroundColor : "bg-white"} ${textColor ? "text-" + textColor : "text-black"} ${className ?? ""}`}
                    type={type ?? "date"}
                    name={name}
                    value={value}
                    onChange={handleChange}

                />
                {error && <p className="msg-warning">{error}</p>}

            </div>
        </div>
    );
};