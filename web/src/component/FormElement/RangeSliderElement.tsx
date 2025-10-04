import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import './css/SliderElement.css'
interface Props<T> {
  title?: string;
  name: string;
  secondName: string;
  isRequired: boolean;
  setRecord: (input: T) => void;
    record: T;
  error?: string;
  minValue?: number;
  maxValue?: number;
  handleClick?: () => void;
  width?: string;
  readonly?: boolean;
  clickonly?: boolean;
  id?: string;
  handleValidation?: (field: string, value: any) => void;
}

export const RangeSliderElement = <T extends {}>({ handleValidation,
  id,
  clickonly,
  width,
  handleClick,
  minValue,
  maxValue,
  name,
  secondName,
  title,
  isRequired,
  setRecord,
  record,
  error,
  readonly,}:Props<T>)=> {
 

  const [range, setRange] = useState<number[]>(minValue&&maxValue ? [minValue,maxValue] : [18, 22]);

  useEffect(() => {
    if(minValue && maxValue)
      setRange([minValue, maxValue]);
  }, [minValue, maxValue]);

  function handleChange(newRange: number[]) {
    if (handleValidation) handleValidation(name, newRange);
    setRange(newRange);
    setRecord({ ...record, [name]: newRange[0], [secondName]:newRange[1] });
  }

  const work = () => {
    if (handleClick) {
      handleClick();
    }
  };

  return (
    <div className="flex flex-col w-[500px]">
      <div className="mb-1">
        <label>
          <p className={`whitespace-nowrap ${isRequired ? 'text-[#CC311B]' : ''}`}>
            {isRequired && title && '*'}
            {title}
          </p>
        </label>
      </div>
      <div style={{ width: width ? `${width}` : '100%' }}>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="thumb"
          trackClassName="track"
          min={18}
          max={65}
          value={range}
          onChange={handleChange}
          disabled={readonly || clickonly}
        />
        <div className="flex  mt-2">
          <span>Range: {range[0] } - {range[1]}</span>
        </div>
        {error && <p className="msg-warning">{error}</p>}
      </div>
    </div>
  );
};