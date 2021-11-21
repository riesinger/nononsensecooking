import { GetServerSidePropsContext } from "next";
import { NextRouter } from "next/router";

export function queryParam(name: string) {
  return {
    from: (contextOrRouter: GetServerSidePropsContext | NextRouter) => {
      const { query } = contextOrRouter;
      const param = query[name];
      return param instanceof Array ? param[0] : param;
    },
  };
}
