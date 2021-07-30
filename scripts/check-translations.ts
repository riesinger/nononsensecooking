// Checks whether all translation files contain the same keys

import fs from "fs/promises";
import path from "path";
import config from "../next-i18next.config.js";

const supportedLocales = config.i18n.locales;

async function main() {
  let hadError = false;
  let allTranslations: { [locale: string]: string[] } = {};
  for (let locale of supportedLocales) {
    allTranslations[locale] = await readTranslations(locale);
  }
  for (let i = 0; i < supportedLocales.length; i++) {
    for (let j = i + 1; j < supportedLocales.length; j++) {
      const first = supportedLocales[i];
      const second = supportedLocales[j];
      console.log(`⚙️ Comparing ${first} with ${second}`);
      for (let translationInFirst of allTranslations[first]) {
        if (!allTranslations[second].includes(translationInFirst)) {
          console.error(
            `🚨 ${first} has the translation key ${translationInFirst}, which ${second} is missing`
          );
          hadError = true;
        }
      }
      for (let translationInSecond of allTranslations[second]) {
        if (!allTranslations[first].includes(translationInSecond)) {
          console.error(
            `🚨 ${second} has the translation key ${translationInSecond}, which ${first} is missing`
          );
          hadError = true;
        }
      }
    }
  }

  return hadError;
}

async function readTranslations(locale: string) {
  try {
    const files = await fs.readdir(
      path.resolve(__dirname, "..", "public", "locales", locale)
    );
    const allTranslations = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(
          path.resolve(__dirname, "..", "public", "locales", locale, file)
        );
        const translations = JSON.parse(content.toString());
        console.log(`⚙️ Parsing translations for ${locale}/${file}`);
        const parsedTranslations = parseTranslations(file, translations);
        return parsedTranslations;
      })
    );
    return allTranslations.reduce((acc, t) => [...acc, ...t], []);
  } catch (err) {
    throw new Error(
      `We're supporting ${locale} as a locale, but the translation directory for it couldn't be read: ${err}`
    );
  }
}

function parseTranslations(file: string, rawTranslations: object) {
  return recurse(rawTranslations)
    .map((key: string) => [file, key].join("."))
    .sort();
}

function recurse(translationsObject: object | string | number) {
  if (!isObject(translationsObject)) return [];
  const currentKeys = [];
  const entries = Object.entries(translationsObject);
  const entriesWithoutChildren = entries.filter(
    ([_, value]) => value && !isObject(value)
  );
  const entriesWithChildren = entries.filter(([_, value]) => isObject(value));
  currentKeys.push(...entriesWithoutChildren.map(([key, _]) => key));
  for (let [key, value] of entriesWithChildren) {
    const subkeys = recurse(value);
    for (let subkey of subkeys) {
      currentKeys.push(`${key}.${subkey}`);
    }
  }
  return currentKeys;
}

const isObject = (value: unknown) => typeof value === "object";

main()
  .then((hadError) => process.exit(hadError ? 1 : 0))
  .catch(console.error);
