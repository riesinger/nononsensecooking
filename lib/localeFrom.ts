import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { isSupportedLanguage, SupportedLanguage } from "../models/Localized";

export default function languageFrom(
  context: GetServerSidePropsContext<any> | GetStaticPropsContext<any>
): SupportedLanguage {
  return isSupportedLanguage(context.locale)
    ? context.locale
    : (context.defaultLocale as SupportedLanguage);
}
