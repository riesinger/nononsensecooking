import fs from "fs/promises";
import inquirer from "inquirer";
import { customAlphabet } from "nanoid";
import path from "path";
import config from "../next-i18next.config.js";

const supportedLocales = config.i18n.locales;
const supportedDiets = ["meat", "fish", "vegetarian", "vegan"];

const questions = [
  {
    type: "checkbox",
    name: "localesToGenerate",
    message: "For which locales would you like to generate a recipe template?",
    choices: supportedLocales,
    default: supportedLocales,
  },
  {
    type: "list",
    name: "diet",
    message: "What diet is the new recipe?",
    choices: supportedDiets,
  },
];

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-",
  10
);
const basePath = path.resolve("./public/recipes");

const recipeTemplate = (diet: typeof supportedDiets) =>
  `
name: 
longName: 
image: ""
cookTime: 20
diet: ${diet}
ingredients:
  - name:
    amount:
    unit:
    scales: true
steps:
  -
`.trimStart();

async function main() {
  const answers = await inquirer.prompt(questions);
  const recipeId = nanoid();
  for (const locale of answers.localesToGenerate) {
    const newRecipeFile = `${basePath}/${locale}/${recipeId}.yaml`;
    await fs.writeFile(newRecipeFile, recipeTemplate(answers.diet));
    console.log("Created", newRecipeFile);
  }
}

main().then().catch(console.error);
