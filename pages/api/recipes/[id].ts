import { NextApiRequest, NextApiResponse } from "next";
import { SupportedLanguage } from "../../../models/Localized";
import { Recipe, RecipeID } from "../../../models/Recipe";
import { allRecipes, translateTo } from "../recipes";
import { getLanguage } from "../utils/getLanguage";
import { methodIs } from "../utils/methodIs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!methodIs("GET", req, res)) return;
  const lang = getLanguage(req);
  const { id } = req.query;
  // TODO: Do some actual validation here in the future
  res.status(200).json(await recipeById(lang, id as RecipeID));
};

export async function recipeById(
  language: SupportedLanguage,
  id: RecipeID
): Promise<Recipe | undefined> {
  const recipe = (await allRecipes()).find((recipe) => recipe.id === id);
  if (!recipe) {
    console.warn("Could not find recipe with id", id);
    return undefined;
  }
  return translateTo(language)(recipe);
}
