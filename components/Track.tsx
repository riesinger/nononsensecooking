import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Track = ({ children }: Props) => (
  <div className="grid w-full gap-8 grid-cols-1 lg:grid-cols-3">{children}</div>
);

export default Track;
