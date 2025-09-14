import React from "react";
import { DatePicker } from "antd";
import ptBR from "antd/es/date-picker/locale/pt_BR";
import { DatePickerProps } from "antd/es/date-picker";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

interface DateFieldProps {
  label: string;
  hasError: boolean;
  helperText: string | undefined;
  value?: string;
  onChange: (date: string) => void;
}

export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  hasError,
  helperText,
}) => {
  const handleChangeDate: DatePickerProps["onChange"] = (date) => {
    if (date) {
      onChange(date.toISOString());
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        className={twMerge(
          "font-normal text-auxiliary-beige text-sm focus-within:font-semibold",
          hasError && "text-auxiliary-error font-semibold"
        )}
      >
        {label}
      </label>
      <DatePicker
        id="date-picker"
        value={value ? dayjs(value) : undefined}
        onChange={handleChangeDate}
        locale={ptBR}
        size="small"
        format="DD/MM/YYYY"
        className={twMerge(
          "shadow-none resize-none w-full px-4 py-3 rounded-[0.625rem] text-base text-primary-dark bg-auxiliary-beige border border-auxiliary-beige focus:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-darkOpacity",
          hasError && "border-auxiliary-error"
        )}
        style={{ color: "red", fontSize: "2rem" }}
      />
      {hasError && (
        <p className="text-auxiliary-error font-base text-sm focus-within:font-semibold">
          {helperText}
        </p>
      )}
    </div>
  );
};
