import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  onConfirm?: (event: React.MouseEvent<HTMLElement> | any) => void;
  state?: "disabled" | "enabled";
  label: string | JSX.Element | ReactNode;
  className?: string;
  startIcon?: JSX.Element | ReactNode;
}

const content = tv({
  base: "w-full flex items-center justify-center font-bold p-4 rounded-[0.625rem] transition-all duration-200 ease-in-out hover:cursor-pointer hover:brightness-90",
  variants: {
    state: {
      enabled: "bg-secondary-light text-primary-dark",
      disabled:
        "bg-secondary-light brightness-75 text-neutral-500 hover:cursor-not-allowed",
    },
  },
});

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  onConfirm,
  state = "enabled",
  label,
  className,
  startIcon,
}) => {
  return (
    <button
      type={type}
      disabled={state === "disabled"}
      onClick={onConfirm}
      className={twMerge(content({ state }), className)}
    >
      {startIcon}
      {label}
    </button>
  );
};
