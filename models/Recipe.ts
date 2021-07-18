import { Ingredient } from "./Ingredient";

export interface Recipe {
  id: string;
  name: string;
  slug: string;
  longName: string | undefined;
  image: string;
  cookTime: number;
  diet: "meat" | "fish" | "vegetarian" | "vegan";
  steps: string[];
  ingredients: Ingredient[];
}

export interface RecipeFile {
  name: string;
  longName: string | undefined;
  image: string;
  cookTime: number;
  diet: "meat" | "fish" | "vegetarian" | "vegan";
  steps: string[];
  ingredients: Ingredient[];
}

export interface RecipeInIndex {
  id: string;
  name: string;
  slug: string;
  image: string;
  cookTime: string;
  diet: string;
}
