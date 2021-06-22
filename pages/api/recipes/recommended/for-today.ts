import { NextApiRequest, NextApiResponse } from "next";
import { SupportedLanguage } from "../../../../models/Localized";
import { allRecipes, translateTo } from "../../recipes";
import { getLanguage } from "../../utils/getLanguage";
import { methodIs } from "../../utils/methodIs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!methodIs("GET", req, res)) return;
  const lang = getLanguage(req);
  res.status(200).json(await recipesOfTheDayForLanguage(lang));
};

function shuffleArray(arr: any[]) {
  arr.sort(() => Math.random() - 0.5);
}

export async function recipesOfTheDayForLanguage(language: SupportedLanguage) {
  const recipes = [...(await allRecipes())];
  shuffleArray(recipes);
  return recipes.slice(0, 3).map(translateTo(language));
}
