import { Ingredient } from "./Ingredient";

export interface Recipe {
  id: string;
  name: string;
  slug: string;
  image: string;
  cookTime: number;
  diet: "meat" | "fish" | "vegetarian" | "vegan";
  steps: string[];
  ingredients: Ingredient[];
}

export interface RecipeFile {
  name: string;
  image: string;
  cookTime: number;
  diet: "meat" | "fish" | "vegetarian" | "vegan";
  steps: string[];
  ingredients: Ingredient[];
}

export type RecipeInIndex = Pick<
  Recipe,
  "id" | "name" | "slug" | "image" | "cookTime" | "diet"
>;
