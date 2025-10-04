import React, { ChangeEvent, useState } from 'react'

const errorMsg = {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '-2px'
}

interface Prop<T> {
    title: string;
    name: string;
    value?: string | number | readonly string[] | undefined ;
    setRecord: (input: T) => void;
    record: T;
    error?: string;
    width?: string;
    isPassword?: boolean
    isRequired?: boolean
    handleValidation?: (field: string, value: any) => void

}

export const LoginInput = <T extends {}>({
    value,
    title,
    name,
    record,
    setRecord,
    error,
    width,
    isPassword,
    isRequired,
    handleValidation
}: Prop<T>) => {

    const [visible, setVisible] = useState(false);
    const visibleSrc = "/asset/login/Password/visible.png"
    const invisibleSrc = "/asset/login/Password/invisible.png"

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (handleValidation ) handleValidation(name, value)

        setRecord({ ...record, [name]: value })
    }

    function handleVisible() {
        setVisible(!visible);
    }
    return (
        <div className="flex flex-col">
            <div className="mb-1">
                <label className=''>
                    <p className={`whitespace-nowrap  ${isRequired ? "text-[#CC311B]" : "text-trans-gray"}`}>
                        {isRequired && title && "*"}
                        {title}
                    </p>
                </label>
            </div>
            <div className="relative">
                <input
                    type={isPassword ? (visible ? "text" : "password") : ""}
                    className={` ${width ? "w-" + width : "w-full"}  h-[30px] border-2 rounded-lg border-trans-gray pl-2`} value={value} name={name} onChange={handleChange} />

                {isPassword &&
                    <div className="absolute inset-y-0 right-0 flex items-center cursor-pointer mr-2" onClick={handleVisible} >
                        <div className="flex items-center h-[30px]">
                            <img src={visible ? invisibleSrc : visibleSrc} />
                        </div>

                    </div>}
                {error && <p className="msg-warning">{error}</p>}

            </div>
        </div>
    )
}