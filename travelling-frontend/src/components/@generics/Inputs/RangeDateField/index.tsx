import React, { useMemo } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import ptBR from "antd/es/date-picker/locale/pt_BR";
import { RangePickerProps } from "antd/es/date-picker";

interface RangeDateFieldProps {
  label: string;
  value: [string | undefined, string | undefined];
  onChange: (date: [string, string]) => void;
}

const { RangePicker } = DatePicker;

export const RangeDateField: React.FC<RangeDateFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  const handleChangeDate: RangePickerProps["onChange"] = (
    dates,
    dateStrings
  ) => {
    if (dates) {
      onChange([
        new Date(dateStrings[0]).toISOString(),
        new Date(dateStrings[1]).toISOString(),
      ]);
    } else {
      const dateNow = new Date().toISOString();
      onChange([dateNow, dateNow]);
    }
  };

  const startDate = useMemo(() => {
    if (value.includes(undefined)) {
      return dayjs(new Date().toISOString(), "YYYY/MM/DD");
    } else {
      return dayjs(value[0], "YYYY/MM/DD");
    }
  }, [value]);

  const endDate = useMemo(() => {
    if (value.includes(undefined)) {
      return dayjs(new Date().toISOString(), "YYYY/MM/DD");
    } else {
      return dayjs(value[1], "YYYY/MM/DD");
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-normal text-auxiliary-beige text-sm focus-within:font-semibold">
        {label}
      </label>
      <RangePicker
        className="h-full w-full rounded-lg py-2 xs:py-3 sm:py-3"
        locale={ptBR}
        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
        placeholder={["Data inicial", "Data final"]}
        size="large"
        value={[startDate, endDate]}
        onChange={handleChangeDate}
      />
    </div>
  );
};
