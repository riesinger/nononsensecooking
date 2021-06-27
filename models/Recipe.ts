import { Ingredient, TranslatableIngredient } from "./Ingredient";
import { Localized } from "./Localized";

export interface Recipe {
  id: RecipeID;
  name: string;
  fullSlug: string;
  longName: string;
  image: string;
  cookTime: number;
  diet: "meat" | "fish" | "vegetarian" | "vegan";
  steps: string[];
  ingredients: Ingredient[];
}

export interface RecipeFile {
  name: Localized<string>;
  longName: Localized<string>;
  image: string;
  cookTime: number;
  diet: "meat" | "fish" | "vegetarian" | "vegan";
  steps: Localized<string[]>;
  ingredients: TranslatableIngredient[];
}

export type RecipeID = string;

export interface TranslatableRecipe {
  id: RecipeID;
  name: Localized<string>;
  longName: Localized<string>;
  image: string;
  cookTime: number;
  diet: "meat" | "fish" | "vegetarian" | "vegan";
  steps: Localized<string[]>;
  ingredients: TranslatableIngredient[];
}
