import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  icon?: JSX.Element | React.ReactNode;
  placeholder?: string;
  hasError?: boolean;
  helperText?: string;
}

const TextArea: React.ForwardRefRenderFunction<
  HTMLTextAreaElement,
  InputTextAreaProps
> = ({ id, hasError, helperText, ...otherProps }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {!!otherProps.label && (
        <label
          htmlFor={id}
          className={twMerge(
            "font-normal text-auxiliary-beige text-sm focus-within:font-semibold",
            hasError && "text-auxiliary-error font-semibold"
          )}
        >
          {otherProps.label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={id}
          ref={ref}
          className={twMerge(
            "h-32 resize-none py-2 px-5 w-full text-base rounded-[0.625rem] text-primary-dark bg-auxiliary-beige border border-auxiliary-beige focus:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-darkOpacity",
            otherProps.icon && "pr-14",
            hasError && "focus-visible:outline-error border-auxiliary-error"
          )}
          placeholder={otherProps.placeholder}
          {...otherProps}
        />
        <div className="absolute right-5 top-[12px]">{otherProps.icon}</div>
      </div>
      {hasError && <p className="text-auxiliary-error text-sm">{helperText}</p>}
    </div>
  );
};
export const InputTextArea = forwardRef(TextArea);
