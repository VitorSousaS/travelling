import { twMerge } from "tailwind-merge";
import { SingleSelectFieldProps } from ".";

export const Label: React.FC<SingleSelectFieldProps> = (props) => {
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
