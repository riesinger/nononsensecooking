/**
 * SlimRecipe is a recipe without the ingredients and steps being expanded.
 */
export type SlimRecipe = {
  id: string;
  slug: string;
  name: string;
  status: "published" | "draft" | "reviewing";
  diet: "meat" | "fish" | "vegetarian" | "vegan";
  preparationTimeMinutes: number;
  type: "starter" | "main" | "dessert";
  imageUrl?: string;
  /**
   * The name or username of the author.
   * If the author didn't enable their name to be shown, this will be empty.
   */
  writtenBy?: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
};

export type FullRecipe = SlimRecipe & {
  steps: Step[];
  ingredients: Ingredient[];
};

export type Step = {
  stepIndex: number;
  text: string;
};

export type Ingredient = {
  id: string;
  amount: number | null;
  unit: "g" | "kg" | "pc" | "l" | "ml" | "tbsp" | "none";
  scalesWithPortions: boolean;
};

export type Unit = keyof Ingredient["unit"];
