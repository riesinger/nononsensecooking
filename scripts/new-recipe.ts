import fs from "fs/promises";
import inquirer from "inquirer";
import { customAlphabet } from "nanoid";
import path from "path";
import config from "../next-i18next.config.js";

const supportedLocales = config.i18n.locales;
const supportedDiets = ["meat", "fish", "vegetarian", "vegan"];
const defaultCookTime = 25;

const nameQuestions = supportedLocales.map((locale) => ({
  type: "input",
  name: `locale.${locale}.name`,
  message: `What's the name of the recipe in ${locale}?`,
  when: (answers: { localesToGenerate: string[] }) =>
    answers.localesToGenerate.includes(locale),
}));

const questions = [
  {
    type: "checkbox",
    name: "localesToGenerate",
    message: "For which locales would you like to generate a recipe template?",
    choices: supportedLocales,
    default: supportedLocales,
  },
  ...nameQuestions,
  {
    type: "list",
    name: "diet",
    message: "What diet is the new recipe?",
    choices: supportedDiets,
  },
  {
    type: "number",
    name: "cookTime",
    message: "How long does this dish take to cook? (minutes)",
    default: defaultCookTime,
  },
];

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-",
  10,
);
const basePath = path.resolve("./public/recipes");

type TemplateParameters = {
  name: string;
  diet: typeof supportedDiets;
  cookTime: number;
};

const recipeTemplate = ({ name, diet, cookTime }: TemplateParameters) =>
  `
name: ${name}
image: ""
publishedAt: "${new Date().toISOString()}"
cookTime: ${cookTime}
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
  //@ts-ignore
  const answers = await inquirer.prompt(questions);
  const recipeId = nanoid();
  for (const locale of answers.localesToGenerate) {
    const newRecipeFile = `${basePath}/${locale}/${recipeId}.yaml`;
    const parameters = {
      ...answers.locale[locale],
      cookTime: answers.cookTime,
      diet: answers.diet,
    };
    await fs.writeFile(newRecipeFile, recipeTemplate(parameters));
    console.log("Created", newRecipeFile);
  }
}

main().then().catch(console.error);
