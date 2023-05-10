import clsx from "clsx";
import NextLink from "next/link";

type OwnLinkProps = {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ghost?: boolean;
};

type NextLinkProps = React.ComponentProps<typeof NextLink>;
export type LinkProps = NextLinkProps & OwnLinkProps;

function Link({
  href,
  className,
  leftIcon,
  rightIcon,
  children,
  ghost,
  ...rest
}: LinkProps) {
  const linkClasses = clsx(
    "text-blue-700 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-color inline-flex items-center gap-x-2",
    ghost && "text-gray-700 dark:text-gray-300",
    className
  );

  return (
    <NextLink href={href} className={linkClasses} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </NextLink>
  );
}

export default Link;
