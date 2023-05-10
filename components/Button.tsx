import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
  ReactNode,
} from "react";
import Spinner from "./Spinner";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  colorScheme?: "default" | "negative";
  leftIcon?: ReactNode;
}

const LoadingOverlay = ({ children }: PropsWithChildren) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/80 cursor-default">
    {children}
  </div>
);

export default function Button({
  loading,
  children,
  disabled,
  variant = "secondary",
  colorScheme = "default",
  leftIcon,
  className,
  ...rest
}: Props) {
  const classes = clsx(
    "appearance-none rounded-md py-2 px-3 text-sm font-medium tracking-wide relative cursor-pointer leading-5 transition transition-colors inline-flex w-max items-center gap-x-2 overflow-hidden",
    variant === "primary" && "bg-blue-500 text-white",
    variant === "secondary" &&
      "bg-transparent text-zinc-800 border-2 border-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 dark:border-0 dark:hover:bg-blue-500/20 dark:hover:text-white",
    [
      variant === "ghost" && {
        "bg-transparent": true,
        "text-blue-700 dark:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-100 hover:text-blue-700":
          colorScheme === "default",
        "text-red-500 hover:bg-red-100 hover:text-red-700":
          colorScheme === "negative",
      },
    ],
    className
  );
  const iconClasses = clsx(
    variant === "primary" && "text-zinc-200",
    variant === "secondary" && "text-zinc-600 dark:text-zinc-300"
  );
  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {leftIcon ? <span className={iconClasses}>{leftIcon}</span> : null}
      {children}
      {loading && (
        <LoadingOverlay>
          <Spinner small />
        </LoadingOverlay>
      )}
    </button>
  );
}
