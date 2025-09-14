import React from "react";
import { TimePicker, TimePickerProps } from "antd";
import ptBR from "antd/es/date-picker/locale/pt_BR";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

interface HourFieldProps {
  label: string;
  hasError?: boolean;
  helperText?: string | undefined;
  value?: string;
  onChange: (date: string) => void;
}

export const HourField: React.FC<HourFieldProps> = ({
  label,
  value,
  onChange,
  hasError,
  helperText,
}) => {
  const handleChangeDate: TimePickerProps["onChange"] = (hour) => {
    if (hour) {
      onChange(hour.toISOString());
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <label
        className={twMerge(
          "font-normal text-auxiliary-beige text-sm focus-within:font-semibold h-full",
          hasError && "text-auxiliary-error font-semibold"
        )}
      >
        {label}
      </label>
      <TimePicker
        id="time-picker"
        value={value ? dayjs(value) : undefined}
        onSelect={(hour) => handleChangeDate(hour, hour.toISOString())}
        onChange={handleChangeDate}
        allowClear={false}
        locale={ptBR}
        format="HH:mm"
        className={twMerge(
          "h-full shadow-none resize-none w-full px-4 py-3 rounded-[0.625rem] text-base text-primary-dark bg-auxiliary-beige border border-auxiliary-beige focus:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-darkOpacity",
          hasError && "border-auxiliary-error"
        )}
        style={{ fontSize: "2rem" }}
      />
      {hasError && (
        <p className="text-auxiliary-error font-base text-sm focus-within:font-semibold">
          {helperText}
        </p>
      )}
    </div>
  );
};
