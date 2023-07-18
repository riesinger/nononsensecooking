import { ReactNode } from "react";

type Props = {
  title?: string;
  children?: ReactNode;
  width?: "default" | "narrow";
  smallHeadings?: boolean;
};

export const PaddedSection = ({ title, children, smallHeadings }: Props) => (
  <section
    className="w-full max-w-screen-2xl
   mx-auto px-8 box-border"
  >
    {title ? (
      <h3 className="font-bold text-2xl mt-8 mb-4 leading-snug text-neutral-950 dark:text-neutral-50">
        {title}
      </h3>
    ) : null}
    {children}
  </section>
);
