import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Track = ({ children }: Props) => (
  <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {children}
  </div>
);

export default Track;
