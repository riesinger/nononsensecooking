import { NextApiRequest, NextApiResponse } from "next";
import { orderRecipesByMostPopular } from "../../utils/popularRecipes";
import { fetchRecipeIndex } from "../../utils/recipes";
import { localeFrom } from "./utils/localeFrom";

export default async function popularRecipes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const locale = localeFrom(req);
  const recipes = await fetchRecipeIndex(locale);
  res.setHeader("Cache-Control", "s-maxage=3600"); // Cache the results for 1h on the Vercel edge cache
  res.json(await orderRecipesByMostPopular(locale, recipes));
}
