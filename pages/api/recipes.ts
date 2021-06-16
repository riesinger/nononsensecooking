// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import YAML from "yaml";
import { Recipe, RecipeFile, TranslatableRecipe } from "../../models/Recipe";
import { SupportedLanguage } from "../../models/Localized";
import { Ingredient, TranslatableIngredient } from "../../models/Ingredient";

let _allRecipes: TranslatableRecipe[] = [];

export async function allRecipes(): Promise<TranslatableRecipe[]> {
  if (_allRecipes.length == 0) {
    _allRecipes = await loadRecipes();
  }
  return _allRecipes;
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
    longName: recipe.longName[lang],
    image: recipe.image,
    cookTime: recipe.cookTime,
    diet: recipe.diet,
    steps: recipe.steps[lang],
    ingredients: recipe.ingredients.map(translateIngredient(lang)),
  });

const translateIngredient =
  (lang: SupportedLanguage) =>
  (ingredient: TranslatableIngredient): Ingredient => ({
    name: ingredient.name[lang],
    scales: ingredient.scales || false,
    amount: ingredient.amount || null,
    unit: ingredient.unit || null,
  });
