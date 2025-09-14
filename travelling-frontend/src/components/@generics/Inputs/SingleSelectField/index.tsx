import React, { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { OptionType } from "../../../../interfaces";
import { Label } from "./Label";
import { MenuDropdown } from "./MenuDropdown";
import { useOnClickOutside } from "usehooks-ts";

export interface SingleSelectFieldProps {
  id: string;
  label?: string;
  icon?: JSX.Element | React.ReactNode;
  defaultSelected?: OptionType;
  placeholder?: string;
  hasError?: boolean;
  helperText?: string;
  options: OptionType[];
  value: OptionType | null;
  onChange: (value: OptionType | null) => void;
}

const DEFAULT_OPTION = null;

export const SingleSelectField: React.FC<SingleSelectFieldProps> = (props) => {
  const refOutside = useRef(null);

  const [selectedItem, setSelectedItem] = useState<OptionType | null>(
    DEFAULT_OPTION
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (props.defaultSelected) {
      setSelectedItem(props.defaultSelected);
    } else {
      setSelectedItem(DEFAULT_OPTION);
    }
  }, []);

  const handleClearInputs = () => {
    setSelectedItem(DEFAULT_OPTION);
    props.onChange(DEFAULT_OPTION);
  };

  const toggleDropdown = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const toggleSelection = useCallback(
    (item: OptionType) => {
      setSelectedItem(item);
      props.onChange(item);
      setIsOpen(false);
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
          {selectedItem === null && (
            <span className="text-[#9ca3af] select-none">
              {props.placeholder}
            </span>
          )}

          {selectedItem !== null && (
            <div className="max-w-[90%] flex flex-wrap items-center">
              <p className="text-primary-dark font-medium">
                {selectedItem?.label}
              </p>
            </div>
          )}

          <div className="absolute flex items-center justify-center top-1/2 -translate-y-1/2 right-4">
            {selectedItem !== null ? (
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
            selectedItem={selectedItem}
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
