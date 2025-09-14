import { twMerge } from "tailwind-merge";
import { SelectInputFieldProps } from ".";

export const Label: React.FC<SelectInputFieldProps> = (props) => {
  return (
    !!props.label && (
      <label
        className={twMerge(
          "font-normal text-auxiliary-beige text-sm focus-within:font-semibold",
          props.hasError && "text-auxiliary-error font-semibold"
        )}
        htmlFor={props.id}
      >
        {props.label}
      </label>
    )
  );
};
