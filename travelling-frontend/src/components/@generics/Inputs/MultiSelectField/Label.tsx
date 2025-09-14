import { twMerge } from "tailwind-merge";
import { MultiSelectFieldProps } from ".";

export const Label: React.FC<MultiSelectFieldProps> = (props) => {
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
