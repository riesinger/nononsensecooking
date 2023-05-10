export type SupportedLanguage = "en" | "de";
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return ["en", "de"].includes(lang);
}
