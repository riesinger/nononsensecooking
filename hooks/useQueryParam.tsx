import { GetServerSidePropsContext } from "next";
import { NextRouter } from "next/router";

export function useQueryParam(
  contextOrRouter: GetServerSidePropsContext | NextRouter,
  name: string,
  fallback: any
) {
  const { query } = contextOrRouter;
  if (!query[name]) {
    return fallback;
  }
  const param = query[name];
  if (param instanceof Array) {
    return param[0];
  }
  return param;
}
