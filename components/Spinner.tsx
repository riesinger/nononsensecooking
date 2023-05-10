import clsx from "clsx";

function Spinner({ small }: { small?: boolean }) {
  const classes = clsx(
    "inline-block rounded-full border-4 border-zinc-200 border-t-blue-700 dark:border-zinc-800 dark:border-t-blue-500 animate-spin w-12 h-12",
    small && "w-6 h-6 border-2"
  );
  return <div className={classes} />;
}

export default Spinner;
