import React from "react";
import { InputNumber, Slider } from "antd";
import _ from "lodash";

export interface SlideFieldProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export const SlideField: React.FC<SlideFieldProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  minLabel,
  maxLabel,
}) => {
  const handleChangeSlide = (newValue: number) => {
    onChange(newValue);
  };

  const handleChangeInput = (newValue: number) => {
    onChange(newValue);
  };

  const currentValue = isNaN(value) ? max : value;

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
          value={currentValue ?? min}
          onChange={(value) => handleChangeInput(value!!)}
        />
        <Slider
          className="w-full mx-6"
          marks={marks}
          min={min}
          max={max}
          value={currentValue}
          onChange={handleChangeSlide}
        />
      </div>
    </div>
  );
};
