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
  if (query[name] instanceof Array) {
    return query[name][0];
  }
  return query[name];
}
