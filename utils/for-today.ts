import { SupportedLanguage } from "../models/Localized";
import { allRecipes, translateTo } from "./recipes";

function shuffleArray(arr: any[]) {
  arr.sort(() => Math.random() - 0.5);
  return arr;
}

let _recipesForTheDay = null;

async function recipesForTheDay() {
  if (!_recipesForTheDay) {
    _recipesForTheDay = shuffleArray([...(await allRecipes())]).slice(0, 3);
  }
  return _recipesForTheDay;
}

export async function recipesOfTheDayForLanguage(language: SupportedLanguage) {
  return (await recipesForTheDay()).map(translateTo(language));
}
