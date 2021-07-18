import fs from "fs/promises";
import path from "path";
import YAML from "yaml";

const basePath = "./public/recipes";

async function loadRecipes() {
  console.info("Loading all recipes");
  const recipeFiles = await fs.readdir(basePath);
  console.info("Found", recipeFiles.length, "recipes");
  return await Promise.all(
    recipeFiles.map(async (recipeFile) => {
      const recipe = YAML.parse(
        await fs.readFile(basePath + "/" + recipeFile, "utf-8")
      );
      const id = recipeFile.split(".")[0];
      return {
        id,
        ...recipe,
      };
    })
  );
}

async function generateIndex() {
  const recipes = await loadRecipes();
  const slimRecipes = recipes
    .map((r) => ({
      id: r.id,
      name: r.name,
      image: r.image,
      cookTime: r.cookTime,
      diet: r.diet,
    }))
    .filter((r) => r.id !== "index");
  const targetFile = path.join(basePath, "index.json");
  console.log("Writing to", targetFile);
  await fs.writeFile(targetFile, JSON.stringify(slimRecipes));
}

generateIndex().catch(console.error);
