import React, {
  SelectHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { OptionType } from "../../../../interfaces";
import { Control, useController } from "react-hook-form";
import { Label } from "./Label";
import { SelectChip } from "./SelectChip";
import { MenuDropdown } from "./MenuDropdown";
import { useOnClickOutside } from "usehooks-ts";

export interface SelectInputFieldProps
  extends SelectHTMLAttributes<HTMLDivElement> {
  id: string;
  label?: string;
  icon?: JSX.Element | React.ReactNode;
  defaultSelected?: OptionType[];
  placeholder?: string;
  hasError?: boolean;
  helperText?: string;
  options: OptionType[];
  control: Control<any>; // Pass the control prop from react-hook-form
  mode?: "inputable" | "selectable";
}

const SelectInput: React.ForwardRefRenderFunction<
  HTMLDivElement,
  SelectInputFieldProps
> = ({ mode = "selectable", ...props }, ref) => {
  const refOutside = useRef(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<OptionType[]>([]);
  const [inputedItems, setInputedItems] = useState<OptionType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const {
    field: { onChange, value },
  } = useController({
    name: props.id,
    control: props.control,
    defaultValue: [],
  });

  useEffect(() => {
    if (props.defaultSelected && props.defaultSelected.length > 0) {
      setSelectedItems(props.defaultSelected);
    } else {
      setSelectedItems([]);
    }
  }, []);

  const currentOptions =
    mode === "selectable" ? props.options : inputedItems.concat(props.options);

  const handleClearInputs = () => {
    setSelectedItems([]);
    onChange([]);
  };

  const toggleDropdown = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const toggleSelection = useCallback(
    (item: OptionType) => {
      if (value.includes(item.value)) {
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((selected) => selected.value !== item.value)
        );
        onChange(value.filter((selected: string) => selected !== item.value));
      } else {
        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
        onChange([...value, item.value]);
      }
    },
    [value]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.length > 0) {
      e.preventDefault();
      const newValue = {
        label: inputValue,
        value: inputValue,
      };

      const existsInOptions = currentOptions.some(
        (option) => option.value === newValue.value
      );

      if (!existsInOptions) {
        toggleSelection(newValue);
        setInputedItems((prevInputedItems) => [...prevInputedItems, newValue]);
        setInputValue("");
      }
    }
  };

  useOnClickOutside(refOutside, handleClickOutside);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label {...props} />

      <div className="relative" ref={refOutside}>
        <div
          ref={ref}
          className={twMerge(
            "flex gap-2 p-2 cursor-pointer resize-none py-3 px-5 w-full text-base rounded-[0.625rem] text-primary-dark bg-auxiliary-beige border border-auxiliary-beige focus:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-darkOpacity",
            props.icon && "pr-14",
            props.hasError &&
              "focus-visible:outline-error border-auxiliary-error"
          )}
          onClick={toggleDropdown}
        >
          {selectedItems.length === 0 && mode === "selectable" && (
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

          {mode === "inputable" && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              placeholder={props.placeholder}
              onKeyDown={onKeyDown}
              className="bg-transparent outline-none text-primary-dark"
            />
          )}

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
            options={currentOptions}
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

export const SelectField = forwardRef(SelectInput);
