import { NextApiRequest, NextApiResponse } from "next";
import { fetchMostPopularRecipes } from "../../utils/popularRecipes";
import { localeFrom } from "./utils/localeFrom";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const locale = localeFrom(req);
  res.json(await fetchMostPopularRecipes(locale));
}
