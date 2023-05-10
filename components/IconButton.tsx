import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import Spinner from "./Spinner";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  colorScheme?: "default" | "negative";
  icon: ReactNode;
  ariaLabel: string;
}

const LoadingOverlay = (props) => (
  <div
    className="absolute inset-0 bg-white/50 text-center pt-3 pl-3 cursor-default"
    {...props}
  />
);

export default function Button({
  loading,
  disabled,
  variant = "secondary",
  colorScheme = "default",
  ariaLabel,
  icon,
  ...rest
}: Props) {
  const className = clsx(
    "appearance-none rounded-full flex items-center justify-center text-sm font-medium tracking-wide relative cursor-pointer leading-5 transition transition-colors w-10 h-10 box-border flex-shrink-0",
    variant === "primary" && "bg-blue-500 text-white",
    variant === "secondary" &&
      "bg-transparent text-zinc-800 border-2 border-zinc-300 hover:bg-zinc-100 dark:bg-blue-500/10 dark:text-zinc-100 dark:border-0 dark:hover:bg-blue-500/20 dark:hover:text-white",
    [
      variant === "ghost" && {
        "bg-transparent": true,
        "text-blue-500 hover:bg-blue-100 hover:text-blue-700":
          colorScheme === "default",
        "text-red-500 hover:bg-red-100 hover:text-red-700":
          colorScheme === "negative",
      },
    ]
  );
  return (
    <button
      className={className}
      disabled={disabled || loading}
      {...rest}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {icon}
      {loading && (
        <LoadingOverlay>
          <Spinner small />
        </LoadingOverlay>
      )}
    </button>
  );
}
