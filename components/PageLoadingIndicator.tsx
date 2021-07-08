import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Indicator = styled.div<{ isLoading: boolean }>`
  width: 100%;
  height: 5px;
  background: var(--color-primary);
  box-shadow: 0px 1px 15px hsla(var(--palette-blue-40), 85%);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
  transition: transform 0.3s ease-in-out;
  transform: scaleX(${({ isLoading }) => (isLoading ? "0.9" : 0)});
  visibility: ${({ isLoading }) => (isLoading ? "visible" : "hidden")};
  transform-origin: left;
`;

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
  return <Indicator isLoading={loading} />;
};

export default PageLoadingIndicator;
