export interface RecipeDTO {
  id: string;
  collectionId: string;
  collectionName: string;
  preparationTime: number;
  diet: "vegan" | "vegetarian" | "meat" | "fish";
  type: "starter" | "main" | "dessert";
  status: "published" | "draft" | "reviewing";
  image: string;
  writtenBy: string;
  name: string;
  locale: string;
  created: string;
  updated: string;
  slug: string;
  showAuthor: boolean;
}

export interface StepDTO {
  id: string;
  stepIndex: number;
  text: string;
}

export interface IngredientUsageDTO {
  id: string;
  amount: number;
  unit: "g" | "kg" | "pc" | "l" | "ml" | "tbsp" | "none";
  scalesWithPortions: boolean;
  created: string;
  updated: string;
  ingredientId: string;
}
