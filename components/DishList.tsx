interface Props {
  children: React.ReactNode;
}

function DishList({ children }: Props) {
  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {children}
    </div>
  );
}

export default DishList;
