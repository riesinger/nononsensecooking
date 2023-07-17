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
  return (
    <div
      className={clsx(
        "w-full h-1 bg-brand shadow shadow-brand absolute top-0 left-0 z-50 transition-transform duration-300 origin-left scale-x-0",
        loading && "visible scale-x-90",
        !loading && "invisible",
      )}
    />
  );
};

export default PageLoadingIndicator;
