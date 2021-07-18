import { NextApiRequest } from "next";
import {
  isSupportedLanguage as isSupportedLocale,
  SupportedLanguage as SupportedLocale,
} from "../../../models/Localized";

export function localeFrom(req: NextApiRequest): SupportedLocale {
  const lang = req.headers["accept-language"];
  return isSupportedLocale(lang) ? lang : ("en-US" as SupportedLocale);
}
