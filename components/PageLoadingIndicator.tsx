import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PageLoadingIndicator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleStart() {
    setLoading(true);
  }

  function handleStop() {
    setLoading(false);
  }

  useEffect(() => {
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  // TODO: Don't use a CSS variable here but a Tailwind color instead
  const classes = clsx(
    "w-full h-1 bg-blue-500 shadow-[0_1px_15px_hsla(var(--palette-blue-40),85%)] absolute top-0 left-0 z-50 transition-transform duration-300 ease-in-out transform origin-left",
    loading && "scale-x-90 visible",
    !loading && "invisible scale-x-0"
  );
  return <div className={classes} />;
};

export default PageLoadingIndicator;
