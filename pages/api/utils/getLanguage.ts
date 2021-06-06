import { NextApiRequest } from "next";
import {
  SupportedLanguage,
  isSupportedLanguage,
} from "../../../models/Localized";

export function getLanguage(req: NextApiRequest): SupportedLanguage {
  const lang = req.headers["accept-language"];
  return isSupportedLanguage(lang) ? lang : ("en-US" as SupportedLanguage);
}
