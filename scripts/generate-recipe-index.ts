import fs from "fs/promises";
import path from "path";
import { SupportedLanguage } from "../models/Localized";
import config from "../next.config.js";
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
];

async function generateIndex() {
  for (const locale of supportedLocales) {
    console.log("🛠 Generating index for locale", locale);
    const recipes = await loadRecipesFromDisk(
      locale as SupportedLanguage,
      fieldsToIncludeInIndex
    );
    console.log("   👀 Found", recipes.length, "recipes");
    const targetFile = path.join(basePath, `index_${locale}.json`);
    console.log("   📝 Writing to", targetFile);
    await fs.writeFile(targetFile, JSON.stringify(recipes));
  }
}

generateIndex().catch(console.error);
