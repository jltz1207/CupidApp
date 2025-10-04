import { ChangeEvent, useEffect, useState } from "react";

const errorMsg = {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '-2px'
}

interface selectNewProps<T> {
    borderColor?: string;
    className?: string;
    width?: string;
    isRequired: boolean;
    defValue?: any;
    options: string[] | { value: number, name: string }[] | { id: number, name: string }[];
    title: string;
    name: string;
    setRecord: (input: T) => void;
    record: T;
    error?: any;
    isWithApi?: boolean
    onlyRead?:boolean
    onChange?:(id:number | string | boolean)=>void
}

export const SelectElement = <T extends {}>({onChange, onlyRead, isWithApi, className, borderColor, width, isRequired, defValue, options, title, record, setRecord, name, error }: selectNewProps<T>) => {

    //const [selectedOption, setSelectedOption] = useState(defValue);


    function handleChange(event: ChangeEvent<HTMLSelectElement>) {
        let newValue: string | boolean | number = event.target.value;
        console.log(newValue)

        if (!isWithApi && typeof options[0] === "object") {
            newValue = Number(event.target.value)
            newValue = (newValue === 1) ? true : false
            console.log(newValue)
        } else if (!isNaN(Number(event.target.value))) {
            newValue = Number(event.target.value);
            console.log(newValue)
        }
        console.log(newValue)
        setRecord({ ...record, [name]: newValue })
        
        if(onChange){
            onChange(newValue);
        }
    }


    if (defValue === undefined || defValue === "" ||defValue<=0 ) {
        defValue = "placeholder"
    }


    return (
        <div className="flex flex-col " style={{ maxWidth: width ? `${width}px` : '100%' }}>
            <div className="mb-2 w-full">
                <label>
                    <p className={`${isRequired ? "text-[#CC311B]" : ""} whitespace-nowrap`}>
                        {isRequired && "*"}
                        {title}
                    </p>
                </label>
            </div>

            <div className="w-full">
                {/* <DropdownList width={width} options={options} value={selectedOption} onChange={handleChange} placeholder={defValue} /> */}
                <select
                     
                    value={defValue}
                    onChange={handleChange}
                    disabled={onlyRead}
                    className={`w-full h-full border-2 rounded-xl font-bold text-black ${borderColor ? "border-" + borderColor : "border-[#ACACAC]"}   ${className ?? ""} ${onlyRead ? "bg-[#D9D9D94D]":"" } `}
                >
                    <option value="placeholder" disabled hidden >{"- Select Type -"}</option>
                    {!isWithApi && typeof options[0] === "string" && (options as string[]).map((option, index) => (
                        <option
                            key={index}
                            value={option}
                            className="font-bold "
                        >
                            {option}
                        </option>
                    ))}
                    {!isWithApi && typeof options[0] !== "string" && (options as { value: number, name: string }[]).map((option, index) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="font-bold "
                        >
                            {option.name}
                        </option>
                    ))}

                    {isWithApi && (options as { id: number, name: string }[]).map((set) => (
                        <option
                            key={set.id}
                            value={set.id}
                            className="font-bold "
                        >
                            {set.name}
                        </option>
                    ))}


                </select>
                {error && <p style={errorMsg}>{error}</p>}
            </div>
        </div>
    )
}

