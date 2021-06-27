import Fuse from "fuse.js";
import { NextApiRequest, NextApiResponse } from "next";
import { SupportedLanguage } from "../../models/Localized";
import { allRecipes, translateTo } from "./recipes";
import { getLanguage } from "./utils/getLanguage";
import { methodIs } from "./utils/methodIs";

const searchOptions = {
  isCaseSensitive: false,
  includeScore: true,
  includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 2,
  threshold: 0.4,
  distance: 100,
  useExtendedSearch: false,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  shouldSort: true,
  keys: ["name"],
};

export function sanitize(term: string) {
  return term.trim().replace(/[<>]/g, "");
}

export async function searchRecipes(
  language: SupportedLanguage,
  searchTerm: string
) {
  const recipes = (await allRecipes()).map(translateTo(language));
  const fuse = new Fuse(recipes, searchOptions);

  return fuse.search(sanitize(searchTerm));
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!methodIs("GET", req, res)) return;
  const lang = getLanguage(req);
  const { query } = req.query;
  res.status(200).json(await searchRecipes(lang, query as string));
};
