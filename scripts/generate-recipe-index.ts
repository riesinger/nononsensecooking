import fs from "fs/promises";
import path from "path";
import { SupportedLanguage } from "../models/Localized";
import config from "../next-i18next.config.js";
import { loadRecipesFromDisk } from "../utils/recipes";

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
];

async function generateIndex() {
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
  }
}

generateIndex().catch(console.error);
