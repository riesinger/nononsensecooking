import fs from "fs/promises";
import path from "path";
import { loadRecipesFromDisk } from "../lib/recipes_deprecated";
import { SupportedLanguage } from "../models/Localized";
import config from "../next-i18next.config.js";

const basePath = "./public/recipes";
const supportedLocales = config.i18n.locales;
const fieldsToIncludeInIndex = [
  "id",
  "name",
  "image",
  "cookTime",
  "diet",
  "slug",
  "publishedAt",
  "isDraft",
];

async function generateIndex() {
  const allRecipes = {};
  for (const locale of supportedLocales) {
    console.log("🛠 Generating index for locale", locale);
    const recipes = await loadRecipesFromDisk(locale as SupportedLanguage);
    const trimmedRecipes = recipes.map((recipe) =>
      Object.fromEntries(
        Object.entries(recipe).filter(([key, _]) =>
          fieldsToIncludeInIndex.includes(key)
        )
      )
    );
    console.log("   👀 Found", trimmedRecipes.length, "recipes");
    const targetFile = path.join(basePath, `index_${locale}.json`);
    console.log("   📝 Writing to", targetFile);
    await fs.writeFile(targetFile, JSON.stringify(trimmedRecipes));
    for (let recipe of recipes) {
      if (allRecipes[recipe.id]) {
        allRecipes[recipe.id].availableIn.push(locale);
        allRecipes[recipe.id].slugs.push({ locale, slug: recipe.slug });
      } else {
        allRecipes[recipe.id] = {
          availableIn: [locale],
          slugs: [{ locale, slug: recipe.slug }],
          image: recipe.image,
        };
      }
    }
  }
  console.log("🛠 Generating the full index");
  const fullIndex = path.join(basePath, "index.json");
  console.log("   👀 Found", Object.keys(allRecipes).length, "recipes");
  console.log("   📝 Writing to", fullIndex);
  await fs.writeFile(fullIndex, JSON.stringify(allRecipes));
}

generateIndex().catch(console.error);
