import clsx from "clsx";
import { HTMLProps } from "react";

function Paragraph({
  children,
  className,
  ...rest
}: HTMLProps<HTMLParagraphElement>) {
  const classes = clsx(
    "max-w-prose my-2 leading-6 text-zinc-700 dark:text-zinc-300",
    className
  );
  return (
    <p className={classes} {...rest}>
      {children}
    </p>
  );
}

export default Paragraph;
