import { PropsWithChildren } from "react";

function DishList({ children }: PropsWithChildren<{}>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
  );
}

export default DishList;
