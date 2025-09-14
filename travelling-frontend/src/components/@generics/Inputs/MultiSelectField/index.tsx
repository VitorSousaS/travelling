import React, { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { OptionType } from "../../../../interfaces";
import { Label } from "./Label";
import { MenuDropdown } from "./MenuDropdown";
import { useOnClickOutside } from "usehooks-ts";
import { SelectChip } from "./SelectChip";

export interface MultiSelectFieldProps {
  id: string;
  label?: string;
  icon?: JSX.Element | React.ReactNode;
  defaultSelected?: OptionType[];
  placeholder?: string;
  hasError?: boolean;
  helperText?: string;
  options: OptionType[];
  value: OptionType[];
  onChange: (value: OptionType[]) => void;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = (props) => {
  const refOutside = useRef(null);

  const [selectedItems, setSelectedItems] = useState<OptionType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (props.defaultSelected && props.defaultSelected.length > 0) {
      setSelectedItems(props.defaultSelected);
    } else {
      setSelectedItems([]);
    }
  }, [props.defaultSelected]);

  const handleClearInputs = () => {
    setSelectedItems([]);
    props.onChange([]);
  };

  const toggleDropdown = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const toggleSelection = useCallback(
    (item: OptionType) => {
      if (props.value.some((value) => value.value === item.value)) {
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((selected) => selected.value !== item.value)
        );
        props.onChange(
          props.value.filter((selected) => selected.value !== item.value)
        );
      } else {
        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
        props.onChange([...props.value, item]);
      }
    },
    [props.value]
  );

  useOnClickOutside(refOutside, handleClickOutside);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label {...props} />

      <div className="relative" ref={refOutside}>
        <div
          className={twMerge(
            "flex gap-2 p-2 cursor-pointer resize-none py-3 px-5 w-full text-base rounded-[0.625rem] text-primary-dark bg-auxiliary-beige border border-auxiliary-beige focus:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-darkOpacity",
            props.icon && "pr-14",
            props.hasError &&
              "focus-visible:outline-error border-auxiliary-error"
          )}
          onClick={toggleDropdown}
        >
          {selectedItems.length === 0 && (
            <span className="text-[#9ca3af] select-none">
              {props.placeholder}
            </span>
          )}

          <div className="max-w-[90%] flex flex-wrap gap-1">
            {selectedItems.map((item) => (
              <SelectChip
                key={item.value}
                item={item}
                toggleSelection={toggleSelection}
              />
            ))}
          </div>

          <div className="absolute flex items-center justify-center top-1/2 -translate-y-1/2 right-4">
            {selectedItems.length > 0 ? (
              <i
                className="absolute top-1/2 right-2 -translate-y-1/2 fa-solid fa-xmark"
                onClick={handleClearInputs}
              />
            ) : (
              <i
                className={
                  isOpen ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"
                }
              />
            )}
          </div>
        </div>

        {isOpen && (
          <MenuDropdown
            isOpen={isOpen}
            options={props.options}
            selectedItems={selectedItems}
            toggleSelection={toggleSelection}
          />
        )}
      </div>

      {props.hasError && (
        <p className="text-auxiliary-error text-sm">{props.helperText}</p>
      )}
    </div>
  );
};
