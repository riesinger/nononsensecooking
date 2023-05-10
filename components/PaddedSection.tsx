import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  title?: string;
  children?: ReactNode;
  width?: "default" | "narrow";
  smallHeadings?: boolean;
};

export function PaddedSection({
  title,
  children,
  width,
  smallHeadings,
}: Props) {
  const classes = clsx(
    "w-full mx-auto mb-16 px-8 box-border",
    width === "narrow" && "max-w-screen-md",
    width === "default" && "max-w-screen-2xl"
  );
  const titleClasses = clsx(
    "text-zinc-900 dark:text-zinc-100 font-medium mb-2",
    smallHeadings ? "text-2xl" : "text-3xl"
  );
  return (
    <section className={classes}>
      {title ? <h3 className={titleClasses}>{title}</h3> : null}
      {children}
    </section>
  );
}
