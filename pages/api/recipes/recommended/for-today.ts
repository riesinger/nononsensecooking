import { NextApiRequest, NextApiResponse } from "next";
import { allRecipes, translateTo } from "../../recipes";
import { SupportedLanguage } from "../../../../models/Localized";
import { getLanguage } from "../../utils/getLanguage";
import { methodIs } from "../../utils/methodIs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!methodIs("GET", req, res)) return;
  const lang = getLanguage(req);
  res.status(200).json(await recipesOfTheDayForLanguage(lang));
};

export async function recipesOfTheDayForLanguage(language: SupportedLanguage) {
  const recipes = await allRecipes();
  // return recipes.slice(0, 3).map(translateTo(language));
  return recipes.map(translateTo(language));
}
