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
  return arr;
}

let _recipesForTheDay = null;

async function recipesForTheDay() {
  if (!_recipesForTheDay) {
    _recipesForTheDay = shuffleArray([...(await allRecipes())]).slice(0, 3);
  }
  return _recipesForTheDay;
}

export async function recipesOfTheDayForLanguage(language: SupportedLanguage) {
  return (await recipesForTheDay()).map(translateTo(language));
}
