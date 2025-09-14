import React, { InputHTMLAttributes, forwardRef, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { currency, number } from "../../../../services";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type?: string;
  label?: string;
  icon?: JSX.Element | React.ReactNode;
  placeholder?: string;
  hasError?: boolean;
  helperText?: string;
  mask?: "currency" | "number";
}

const Input: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputFieldProps
> = ({ id, type = "text", hasError, helperText, ...otherProps }, ref) => {
  const onKeyUp = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    if (otherProps.mask === "number") {
      return number(e);
    } else if (otherProps.mask === "currency") {
      return currency(e);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      {!!otherProps.label && (
        <label
          className={twMerge(
            "font-normal text-auxiliary-beige text-sm focus-within:font-semibold",
            hasError && "text-auxiliary-error font-semibold"
          )}
          htmlFor={id}
        >
          {otherProps.label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          className={twMerge(
            "resize-none py-3 px-5 w-full text-base rounded-[0.625rem] text-primary-dark bg-auxiliary-beige border border-auxiliary-beige focus:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-darkOpacity",
            otherProps.icon && "pr-14",
            hasError && "focus-visible:outline-error border-auxiliary-error"
          )}
          type={type}
          onKeyUp={onKeyUp}
          placeholder={otherProps.placeholder}
          {...otherProps}
        />
        <div className="absolute right-5 top-[12px]">{otherProps.icon}</div>
      </div>
      {hasError && <p className="text-auxiliary-error text-sm">{helperText}</p>}
    </div>
  );
};
export const InputField = forwardRef(Input);
