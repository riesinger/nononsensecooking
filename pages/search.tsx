import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishCard from "../components/DishCard";
import DishList from "../components/DishList";
import { PaddedSection } from "../components/PaddedSection";
import SearchBar from "../components/SearchBar";
import SEO from "../components/SEO";
import languageFrom from "../lib/localeFrom";
import { queryParam } from "../lib/queryParameter";
import { sanitize, searchRecipes } from "./api/search";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const unsanitizedSearchTerm = queryParam("query").from(context);
  if (!unsanitizedSearchTerm) {
    return {
      props: {
        searchTerm: "",
        results: [],
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }
  const searchTerm = sanitize(unsanitizedSearchTerm);
  const results = await searchRecipes(languageFrom(context), searchTerm);
  return {
    props: {
      searchTerm,
      results,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

export default function Search({
  searchTerm,
  results,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
  if (!searchTerm) {
    return (
      <>
        <SEO title={t("search.pagetitle")} />
        <section className="relative flex items-center justify-center flex-col gap-8 w-full max-w-screen-md mt-16 mx-auto px-8 box-border">
          <p className="text-center text-xl">{t("search.findrecipes")}</p>
          <SearchBar placeholder={t("header.searchbar.placeholder")} />
        </section>
      </>
    );
  }
  return (
    <>
      <SEO title={t("search.pagetitle")} />
      <PaddedSection title={t("search.sectiontitle", { searchTerm })}>
        <DishList>
          {results?.map(({ item: recipe }) => (
            <DishCard
              key={recipe.id}
              id={recipe.id}
              slug={recipe.fullSlug}
              {...recipe}
            />
          ))}
        </DishList>
      </PaddedSection>
    </>
  );
}
