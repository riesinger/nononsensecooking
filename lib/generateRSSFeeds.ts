import { Feed } from "feed";
import fs from "fs/promises";
import path from "path";
import { SupportedLanguage } from "../models/Localized";
import { Recipe, RecipeInIndex } from "../models/Recipe";
import { i18n } from "../next-i18next.config";
import { getRecipesFromDiskOrIndex } from "./recipes_deprecated";

const localizedMetadata = {
  "en-US": {
    description:
      "A website featuring curated recipes without the unnecessary bloat",
  },
  "de-DE": {
    description:
      "Eine Website, die kurierte Rezepte vorstellt und auf das Mindeste reduziert ist",
  },
};

const siteURL = "https://nononsense.cooking";
const date = new Date();
const author = {
  name: "Pascal Riesinger",
  email: "pascal@nononsense.cooking",
  link: "https://riesinger.dev",
};

export async function generateRSSFeeds() {
  await Promise.all([
    ...i18n.locales.map(async (locale) => await generateFeedForLocale(locale)),
    generateFeedForLocale(i18n.defaultLocale, true),
  ]);
}

export async function generateFeedForLocale(
  locale: string,
  stripLocaleFromName = false
) {
  const recipes = await getRecipesFromDiskOrIndex(locale as SupportedLanguage);

  const feed = new Feed({
    title: "NoNonsenseCooking",
    description: localizedMetadata[locale].description,
    id: siteURL,
    link: siteURL,
    image: `${siteURL}/android-chrome-512x512.png`,
    favicon: `${siteURL}/favicon-32x32.png`,
    copyright: `CC BY 4.0 - Pascal Riesinger`,
    updated: date,
    generator: "",
    feedLinks: {
      rss2: `${siteURL}/rss/feed.${locale}.xml`,
      json: `${siteURL}/rss/feed.${locale}.json`,
      atom: `${siteURL}/rss/atom.${locale}.xml`,
    },
    author,
  });

  recipes
    .filter((r: RecipeInIndex | Recipe) => !r.isDraft)
    .forEach((recipe) => {
      const url = `${siteURL}/${locale}/r/${recipe.slug}`;

      feed.addItem({
        title: recipe.name,
        id: url,
        link: url,
        description: recipe.name,
        // TODO: The content should be the steps, not the name
        author: [author],
        contributor: [author],
        date: new Date(recipe.publishedAt),
      });
    });

  await fs.mkdir(path.resolve("./public", "rss"), {
    recursive: true,
  });

  await fs.writeFile(
    path.resolve(
      "./public",
      "rss",
      stripLocaleFromName ? "feed.xml" : `feed.${locale}.xml`
    ),
    feed.rss2()
  );
  await fs.writeFile(
    path.resolve(
      "./public",
      "rss",
      stripLocaleFromName ? "feed.json" : `feed.${locale}.json`
    ),
    feed.json1()
  );
  await fs.writeFile(
    path.resolve(
      "./public",
      "rss",
      stripLocaleFromName ? "atom.xml" : `atom.${locale}.xml`
    ),
    feed.atom1()
  );
}
