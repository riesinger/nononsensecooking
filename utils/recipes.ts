import fs from "fs/promises";
import path from "path";
import slug from "slug";
import YAML from "yaml";
import { SupportedLanguage } from "../models/Localized";
import { Recipe, RecipeInIndex } from "../models/Recipe";
import { Unit } from "../models/Unit";

const VERCEL_URL = process.env.VERCEL_URL;
const recipeFilesBasePath = "public/recipes";

export async function fetchRecipeIndex(
  lang: SupportedLanguage
): Promise<RecipeInIndex[]> {
  const baseUrl = VERCEL_URL
    ? `https://${VERCEL_URL}`
    : "http://localhost:3000";
  const recipeIndexPath = `/recipes/index_${lang}.json`;
  const allRecipes = await (await fetch(baseUrl + recipeIndexPath)).json();

  return allRecipes;
}

// TODO: Properly type fieldsToInclude
export async function loadRecipesFromDisk(
  locale: SupportedLanguage,
  fieldsToInclude: string[] = undefined
): Promise<Partial<Recipe>[]> {
  const recipeFiles = await fs.readdir(
    path.join(process.cwd(), recipeFilesBasePath, locale)
  );
  return await Promise.all(
    recipeFiles.map(async (filename) => {
      const file = await fs.readFile(
        path.join(recipeFilesBasePath, locale, filename),
        "utf-8"
      );
      const id = filename.split(".")[0];
      const recipeData = YAML.parse(file);
      const recipe = parseRecipeData(id, recipeData);
      return Object.fromEntries(
        Object.entries(recipe).filter(([key, _]) =>
          fieldsToInclude ? fieldsToInclude.includes(key) : true
        )
      );
    })
  );
}

export async function readSingleRecipeFromDisk(
  lang: SupportedLanguage,
  id: string
) {
  const file = await fs.readFile(
    path.join(recipeFilesBasePath, lang, `${id}.yaml`),
    "utf-8"
  );
  const recipeData = YAML.parse(file);
  return parseRecipeData(id, recipeData);
}

const parseRecipeData = (id: string, recipeData: any): Recipe => ({
  ...recipeData,
  id,
  slug: `${id}/${slug(recipeData.name)}`,
  ingredients: parseIngredients(recipeData.ingredients),
});

const parseIngredients = (
  ingredients: Recipe["ingredients"]
): Recipe["ingredients"] =>
  ingredients.map((ingredient) => ({
    ...ingredient,
    unit: ingredient.unit || Unit.NONE,
  }));
