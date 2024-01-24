import { Locale } from "./locale";

type RecipeMetadata = {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  // How long it takes to prepare the recipe actively. Excludes baking/cooking/cooling time.
  activeTimeInMinutes?: number;
  totalTimeInMinutes: number;
  ingredients: string[];
  steps: string[];
};

export async function getRecipeMetadata(
  id: string,
): Promise<Record<Locale, RecipeMetadata>> {
  return {
    en: {
      id,
      name: "Test recipe in english",
      totalTimeInMinutes: 30,
      ingredients: ["1 cup of water", "2 eggs"],
      steps: ["Mix ingredients", "Cook"],
    },
    de: {
      id,
      name: "Test Rezept auf Deutsch",
      totalTimeInMinutes: 30,
      ingredients: ["1 Tasse wasser", "2 Eier"],
      steps: ["Zutaten mischen", "Kochen"],
    },
  };
}
