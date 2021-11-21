import { SupportedLanguage } from "../../models/Localized";
import * as config from "../../next.config";
import { HttpStatusError } from "./HttpStatusError";

export class PlausibleClient {
  // Which timeframe to respect when looking for the most popular recipes
  readonly POPULAR_RECIPES_PERIOD = "6mo";
  readonly POPULAR_RECIPES_LIMIT = 5;

  constructor(
    private apiKey: string,
    private baseUrl: string,
    private siteId: string
  ) {}

  /**
   * Returns the most popular recipes' ids
   * @param locale The locale to query for
   * @returns A map from Recipe ID to the number of page hits
   */
  public async fetchMostPopularRecipesForLocale(
    locale: SupportedLanguage
  ): Promise<{ [recipeId: string]: number }> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/stats/breakdown?site_id=${this.siteId}&period=${this.POPULAR_RECIPES_PERIOD}&property=event:page&limit=${this.POPULAR_RECIPES_LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    if (response.status < 200 || response.status > 400) {
      throw new HttpStatusError(200, response.status);
    }
    const data = await response.json();
    const { results } = data;
    const scores = results
      .filter(forLocale(locale))
      .filter(onlyRecipes)
      .reduce(toRecipeHitCount, {});
    return scores;
  }
}

function toRecipeHitCount(
  hits: { [recipeId: string]: number },
  hit: PageHitCount
) {
  const matches = hit.page.match(/\/r\/(\w+)/);
  if (!matches) {
    throw new Error(`Could not find recipe id for path ${hit.page}`);
  }
  hits[matches[1]] = hit.visitors;
  return hits;
}

function onlyRecipes(hit: PageHitCount) {
  return hit.page.includes("/r/");
}

function forLocale(locale: SupportedLanguage) {
  return (hit: PageHitCount) => localeOfHit(hit) === locale;
}

function localeOfHit(hit: PageHitCount) {
  const matches = hit.page.match(/\/([a-z]{2}\-[A-Z]{2})/);
  return matches ? matches[1] : config.i18n.defaultLocale;
}

interface PageHitCount {
  page: "string";
  visitors: number;
}
