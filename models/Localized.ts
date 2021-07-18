export type SupportedLanguage = "en-US" | "de-DE";
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return ["en-US", "de-DE"].includes(lang);
}
