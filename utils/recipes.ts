import fs from "fs/promises";
import path from "path";
import slug from "slug";
import YAML from "yaml";
import { SupportedLanguage } from "../models/Localized";
import { Recipe, RecipeFile, RecipeInIndex } from "../models/Recipe";
import { Unit } from "../models/Unit";

const VERCEL_URL = process.env.VERCEL_URL;
const recipeFilesBasePath = "public/recipes";

/**
 * Retrieves the recipe index via HTTP. This function cannot be used during static generation, only in serverless mode!
 * @param lang The locale for which to load the recipe index
 * @returns The list of recipes in the index
 *
 * TODO: Error Handling
 */
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

/**
 * Retrieves the full recipe index via HTTP. This function cannot be used during static generation, only in serverless mode!
 * @returns The full recipe i
 *
 * TODO: Error Handling
 */
export async function fetchFullRecipeIndex() {
  const baseUrl = VERCEL_URL
    ? `https://${VERCEL_URL}`
    : "http://localhost:3000";
  const recipeIndexPath = "/recipes/index.json";
  const index = await (await fetch(baseUrl + recipeIndexPath)).json();
  return index;
}

/**
 * Reads and parses all recipes found on disk for the given language. This function cannot be used in serverless mode, only during static generation!
 * @param locale The locale for which to load the recipes
 * @returns The fully parsed recipes
 */
export async function loadRecipesFromDisk(
  locale: SupportedLanguage
): Promise<Recipe[]> {
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
      return parseRecipeData(id, recipeData);
    })
  );
}

/**
 * Loads the recipes either from disk (default) or from the recipe index (fallback). This can be used both during static generation and in serverless functions.
 * @param locale The language for which to load the recipes
 */
export async function getRecipesFromDiskOrIndex(locale: SupportedLanguage) {
  let allRecipes: Array<Recipe | RecipeInIndex> = [];
  try {
    allRecipes = await loadRecipesFromDisk(locale);
  } catch (err) {
    if (err.code === "ENOENT") {
      // We're running in ISR mode and regenerating the page in a lambda.
      // Load the recipe index via HTTP in this case.
      // This is not the nicest workaround, but since we cannot use HTTP to fetch the index at SSG time and cannot read the files from disk at ISR time,
      // we either have to do it this way or switch to an actual CMS
      allRecipes = await fetchRecipeIndex(locale);
    } else {
      throw err;
    }
  }
  return allRecipes;
}

export async function readSingleRecipeFromDisk(
  lang: SupportedLanguage,
  id: string
) {
  const file = await fs.readFile(
    path.join(recipeFilesBasePath, lang, `${id}.yaml`),
    "utf-8"
  );
  console.log("Read recipe from file", lang, `${id}.yaml`);
  console.log(file);
  const recipeData = YAML.parse(file);
  return parseRecipeData(id, recipeData);
}

const parseRecipeData = (id: string, recipeData: RecipeFile): Recipe => ({
  ...recipeData,
  id,
  slug: `${id}/${slug(recipeData.name)}`,
  ingredients: parseIngredients(recipeData.ingredients),
  publishedAt: recipeData.publishedAt,
});

const parseIngredients = (
  ingredients: Recipe["ingredients"]
): Recipe["ingredients"] =>
  ingredients.map((ingredient) => ({
    ...ingredient,
    unit: ingredient.unit || Unit.NONE,
  }));
