import React from "react";
import { InputNumber, Slider } from "antd";
import _ from "lodash";

export interface RangeFieldProps {
  label?: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export const RangeField: React.FC<RangeFieldProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  minLabel,
  maxLabel,
}) => {
  const currentValue = value.includes(NaN) ? [min, max] : value;

  const handleChangeSlide = (newValue: number | number[]) => {
    onChange(newValue as [number, number]);
  };

  const handleChangeInput = (newValue: number, position: number) => {
    let updatedValue = [...currentValue];
    updatedValue[position] = newValue;
    onChange(updatedValue as [number, number]);
  };

  const marks = {
    [min]: {
      label: <p className="text-xs text-primary-light">{minLabel}</p>,
    },
    [max]: {
      label: <p className="text-xs text-primary-light w-28">{maxLabel}</p>,
    },
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <label className="font-normal text-auxiliary-beige text-sm focus-within:font-semibold">
        {label}
      </label>
      <div className="flex items-center justify-between py-1 gap-2 cursor-pointer resize-none w-full text-base rounded-[0.625rem] text-primary-dark bg-auxiliary-beige border border-auxiliary-beige focus:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-darkOpacity">
        <InputNumber
          min={min}
          max={max}
          style={{ margin: "0 16px" }}
          value={currentValue[0] ?? min}
          onChange={(value) => handleChangeInput(value!!, 0)}
        />
        <Slider
          className="w-[80%] mx-6"
          range
          marks={marks}
          min={min}
          max={max}
          value={currentValue}
          onChange={handleChangeSlide}
        />
        <InputNumber
          min={min}
          max={max}
          style={{ margin: "0 16px" }}
          value={currentValue[1] ?? max}
          onChange={(value) => handleChangeInput(value!!, 1)}
        />
      </div>
    </div>
  );
};
