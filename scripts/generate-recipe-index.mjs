import fs from "fs/promises";
import path from "path";
import slug from "slug";
import YAML from "yaml";
import config from "../next.config.js";

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

// TODO: Re-use the loadRecipes function from utils
async function loadRecipes(locale, fieldsToInclude) {
  const recipeFiles = await fs.readdir(path.join(basePath, locale));
  return await Promise.all(
    recipeFiles.map(async (filename) => {
      const file = await fs.readFile(
        path.join(basePath, locale, filename),
        "utf-8"
      );
      const recipeData = YAML.parse(file);
      const id = filename.split(".")[0];
      const s = `${id}/${slug(recipeData.name)}`;
      const recipe = { id, slug: s, ...recipeData };
      return Object.fromEntries(
        Object.entries(recipe).filter(([key, _]) =>
          fieldsToInclude.includes(key)
        )
      );
    })
  );
}

async function generateIndex() {
  for (const locale of supportedLocales) {
    console.log("🛠 Generating index for locale", locale);
    const recipes = await loadRecipes(locale, fieldsToIncludeInIndex);
    console.log("   👀 Found", recipes.length, "recipes");
    const targetFile = path.join(basePath, `index_${locale}.json`);
    console.log("   📝 Writing to", targetFile);
    await fs.writeFile(targetFile, JSON.stringify(recipes));
  }
}

generateIndex().catch(console.error);
