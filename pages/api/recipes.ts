import fs from "fs/promises";
import slug from "slug";
import YAML from "yaml";
import {
  Ingredient,
  isTranslatableIngredientWithID,
  TranslatableIngredient,
} from "../../models/Ingredient";
import { SupportedLanguage } from "../../models/Localized";
import { Recipe, RecipeFile, TranslatableRecipe } from "../../models/Recipe";
import { Unit } from "../../models/Unit";

let _allRecipes: TranslatableRecipe[] = [];

export interface Paginated<T> {
  totalItems: number;
  items: T[];
}

export async function allRecipes(): Promise<TranslatableRecipe[]> {
  if (_allRecipes.length == 0) {
    _allRecipes = await loadRecipes();
  }
  return _allRecipes;
}

export async function paginatedRecipes(
  start: number,
  limit: number
): Promise<Paginated<TranslatableRecipe>> {
  const r = await allRecipes();
  const totalItems = r.length;
  const items = r.slice(start, start + limit);
  return {
    totalItems,
    items,
  };
}

export async function paginatedRecipesForLanguage(
  lang: SupportedLanguage,
  start: number,
  limit: number
): Promise<Paginated<Recipe>> {
  const r = await paginatedRecipes(start, limit);
  return {
    totalItems: r.totalItems,
    items: r.items
      .map(translateTo(lang))
      .sort((a, b) => (a.name < b.name ? -1 : 1)),
  };
}

async function loadRecipes(): Promise<TranslatableRecipe[]> {
  console.info("Loading all recipes");
  const recipeFiles = await fs.readdir("./recipes");
  console.info("Found", recipeFiles.length, "recipes");
  return await Promise.all(
    recipeFiles.map(async (recipeFile) => {
      const recipe: RecipeFile = YAML.parse(
        await fs.readFile("./recipes/" + recipeFile, "utf-8")
      );
      const id = recipeFile.split(".")[0];
      return {
        id,
        ...recipe,
      };
    })
  );
}

export const translateTo =
  (lang: SupportedLanguage) =>
  (recipe: TranslatableRecipe): Recipe => ({
    id: recipe.id,
    name: recipe.name[lang],
    fullSlug: `${recipe.id}/${slug(recipe.name[lang])}`,
    longName: recipe.longName[lang],
    image: recipe.image,
    cookTime: recipe.cookTime,
    diet: recipe.diet,
    steps: recipe.steps[lang],
    ingredients: recipe.ingredients.map(translateIngredient(lang)),
  });

const translateIngredient =
  (lang: SupportedLanguage) =>
  (ingredient: TranslatableIngredient): Ingredient => {
    return isTranslatableIngredientWithID(ingredient)
      ? {
          id: ingredient.id,
          scales: ingredient.scales || false,
          amount: ingredient.amount || null,
          unit: ingredient.unit || Unit.NONE,
        }
      : {
          name: ingredient.name[lang],
          scales: ingredient.scales || false,
          amount: ingredient.amount || null,
          unit: ingredient.unit || Unit.NONE,
        };
  };
