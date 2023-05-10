import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes, ReactElement } from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  rightDecoration?: ReactElement | string;
  leftDecoration?: ReactElement | string;
  label?: string;
}

export default function Input({
  className,
  type,
  id,
  rightDecoration,
  leftDecoration,
  label,
  ...rest
}: Props) {
  if (type === "checkbox") {
    return (
      <input
        className={clsx(
          "rounded checked:bg-blue-500 hover:bg-blue-600 active:bg-blue-600 checked:hover:bg-blue-600 w-4 h-4 text-base sm:text-sm",
          className
        )}
        type="checkbox"
        {...rest}
      />
    );
  }

  const inputClasses = clsx(
    "text-base sm:text-sm px-4 rounded-lg text-gray-800 leading-4 dark:text-white block min-w-[5ch] bg-transparent border-none focus:ring-0 placeholder:zinc-600 w-full dark:placeholder-zinc-300",
    leftDecoration && "pl-0",
    className
  );

  return label ? (
    <div className="my-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
      >
        {label}
        {rest.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="bg-zinc-200 dark:bg-zinc-800 rounded-md text-gray-800 dark:text-white flex items-center focus-within:ring-2 focus-within:ring-blue-500">
        {leftDecoration && <span className="px-4">{leftDecoration}</span>}
        <input className={inputClasses} {...rest} type={type} />
        {rightDecoration && <span className="px-4">{rightDecoration}</span>}
      </div>
    </div>
  ) : (
    <div className="bg-zinc-200 dark:bg-zinc-800 rounded-md text-gray-800 dark:text-white flex items-center focus-within:ring-2 focus-within:ring-blue-500">
      {leftDecoration && <span className="px-4">{leftDecoration}</span>}
      <input className={inputClasses} {...rest} type={type} />
      {rightDecoration && <span className="px-4">{rightDecoration}</span>}
    </div>
  );
}
