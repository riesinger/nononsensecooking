import { customAlphabet } from "nanoid";
import fs from "fs/promises";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-",
  10
);
const basePath = "./recipes";

const recipeTemplate = `
name:
  en-US:
  de-DE:
longName:
  en-US:
  de-DE:
image: ""
cookTime: 20
diet: vegetarian
ingredients:
  - name:
      de-DE:
      en-US:
    amount:
    unit:
    scales: true
steps:
  en-US:
    -
  de-DE:
    -
`.trimStart();

async function main() {
  const newRecipeFile = `${basePath}/${nanoid()}.yaml`;
  await fs.writeFile(newRecipeFile, recipeTemplate);
  console.log("Created", newRecipeFile);
}

main().then().catch(console.error);
