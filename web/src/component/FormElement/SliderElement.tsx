import React, { ChangeEvent, useEffect, useState } from 'react';
import './css/SliderElement.css'

const errorMsg = {
  color: 'red',
  fontSize: '0.8rem',
  marginTop: '-2px',
};

interface Props<T> {
  title?: string;
  name: string;
  isRequired: boolean;
  setRecord: (input: T) => void;
  record: T;
  error?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  handleClick?: () => void;
  width?: string;
  readonly?: boolean;
  clickonly?: boolean;
  id?: string;
  handleValidation?: (field: string, value: any) => void;
}

export const SliderElement = <T extends {}>({
  handleValidation,
  id,
  clickonly,
  width,
  handleClick,
  value,
  name,
  title,
  isRequired,
  setRecord,
  record,
  error,
  readonly,
  min = 0,
  max = 100,
  step = 1,
}: Props<T>) => {
  const [sliderValue, setSliderValue] = useState<number>(value || -1);

  useEffect(() => {
    if (value !== undefined) {
      setSliderValue(value);
    }
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const {  value } = event.target;
    const numericValue = parseInt(value, 10);
    if (handleValidation) handleValidation(name, numericValue);
    setRecord({ ...record, [name]: numericValue });
    setSliderValue(numericValue);
  }

  const work = () => {
    if (handleClick) {
      handleClick();
    }
  };

  var errorDetected = sliderValue==undefined || sliderValue<0
  return (
    <div className="flex flex-col mb-4">
      <div className="mb-1">
        <label>
          <p className={`whitespace-nowrap ${isRequired ? 'text-[#CC311B]' : ''}`}>
            {isRequired && title && '*'}
            {title}
          </p>
        </label>
      </div>
      <div className="flex items-center" style={{ width: width ? `${width}` : '100%' }}>
        <input

          type="range"
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={handleChange}
          className={` ${readonly || clickonly ? 'bg-[#D9D9D94D]' : ''} relative  h-[40px] border-2 rounded-lg border-[#ACACAC] pl-3`}
          readOnly={readonly || clickonly}
          onClick={work}
        />
        <span className={`${errorDetected?"text-[#ed4956]":''}`}>{errorDetected?"(not yet selected)":sliderValue}</span>
      
      </div>
      {error && <p style={errorMsg}>{error}</p>}
    </div>
  );
};