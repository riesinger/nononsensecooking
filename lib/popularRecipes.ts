import { SupportedLanguage } from "../models/Localized";
import { Recipe, RecipeInIndex } from "../models/Recipe";
import { PlausibleClient } from "./analytics/plausibleApiClient";

const maxTries = process.env.NODE_ENV === "production" ? 5 : 3;

interface APIClient {
  fetchMostPopularRecipesForLocale: (
    locale: SupportedLanguage
  ) => Promise<{ [recipeId: string]: number }>;
}

/**
 * Fetches the most popular recipes by exporting metrics from the analytics and summing up pagehits on recipe pages
 *
 * @param locale The locale to use
 * @param recipes The recipes to be sorted
 * @returns The given recipes ordered from most popular to least popular
 */
export async function orderRecipesByMostPopular(
  locale: SupportedLanguage,
  recipes: Array<Recipe | RecipeInIndex>
) {
  const plausibleApiKey = process.env.PLAUSIBLE_API_KEY;
  // TODO: Read the URL from the config
  const plausibleBaseUrl = "https://plausible.riesinger.dev";
  const apiClient: APIClient = new PlausibleClient(
    plausibleApiKey,
    plausibleBaseUrl,
    "nononsense.cooking"
  );
  const accumulatedPagehits = await apiClient.fetchMostPopularRecipesForLocale(
    locale
  );
  return recipes.sort(byNumberOfPageHits(accumulatedPagehits));
}

type SortableRecipe = Pick<Recipe, "id" | "name">;
/**
 * Sort function for a recipe index.
 * @param hits The accumulated page hits by id
 * @returns Recipe index sorted by descending amount of page hits and subsorted by the recipe names
 */
const byNumberOfPageHits =
  (hits: { [recipeId: string]: number }) =>
  (a: SortableRecipe, b: SortableRecipe) =>
    (hits[b.id] || 0) - (hits[a.id] || 0) || a.name.localeCompare(b.name);
