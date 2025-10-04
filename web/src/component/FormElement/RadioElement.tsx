import React, { ChangeEvent } from 'react'

interface Props<T> {
    title?: string;
    name: string;
    isRequired: boolean;
    setRecord: React.Dispatch<React.SetStateAction<T>>
    options: any
    defaultValue: number
    type: 'boolean' | 'string' | 'number'
}

export default function RadioElement<T extends {}>({ type, defaultValue, options, title, name, isRequired, setRecord }: Props<T>) {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Convert the string event value to a number
        const value = Number(event.target.value);
        console.log(value, defaultValue);
        if (type === 'boolean') {
            setRecord((prev) => {
                return { ...prev, [name]: Boolean(value) };
            });
        }
        else if (type === 'number')
            setRecord((prev) => {
                return { ...prev, [name]: value };
            });
    };
    const formData: any = {}
    return (
        <div className="inline multiple-input-container " >
            <div className="mb-2">
                <label>
                    <p className={`whitespace-nowrap ${isRequired ? "text-[#CC311B]" : ""}`}>
                        {isRequired && title && "*"}
                        {title}
                    </p>

                </label>
            </div>
            <div className="flex multiple-input-options">
                {options.map((item: any, idx: number) => {
                    const itemKey = name + "-" + idx.toString();
                    return (
                        <React.Fragment key={itemKey}>
                            <input
                                id={itemKey}
                                type="radio"
                                name={name}
                                value={idx}
                                onChange={handleChange}
                                checked={defaultValue === idx}
                            />
                            <label htmlFor={itemKey}>{item.name}</label>
                        </React.Fragment>)
                })}

            </div>
        </div>

    )
}
