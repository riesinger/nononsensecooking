import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  label: string;
  id: string;
  children: ReactNode;
  className?: string;
  inlineLabel?: boolean;
}

export default function FormGroup({
  className,
  label,
  id,
  children,
  inlineLabel,
}: Props) {
  const classes = clsx(className, "max-w-md my-2");
  if (inlineLabel) {
    return (
      <div className={clsx(classes, "flex items-center justify-start gap-x-2")}>
        {children}
        <label
          htmlFor={id}
          className="inline-block flex-grow text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          {label}
        </label>
      </div>
    );
  }
  return (
    <div className={classes}>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
