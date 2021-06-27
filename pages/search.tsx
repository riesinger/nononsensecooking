import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishList from "../components/DishList";
import DishListItem from "../components/DishListItem";
import { PaddedSection } from "../components/PaddedSection";
import SEO from "../components/SEO";
import { useQueryParam } from "../hooks/useQueryParam";
import languageFrom from "../utils/languageFrom";
import { sanitize, searchRecipes } from "./api/search";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const unsanitizedSearchTerm = useQueryParam(context, "query", "");
  const searchTerm = sanitize(unsanitizedSearchTerm);
  const results = await searchRecipes(languageFrom(context), searchTerm);
  return {
    props: {
      searchTerm,
      results,
      ...(await serverSideTranslations(context.locale, [
        "common",
        "header",
        "footer",
      ])),
    },
  };
};

export default function Search({
  searchTerm,
  results,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
  return (
    <>
      <SEO title={t("search.pagetitle")} />
      <PaddedSection title={t("search.sectiontitle", { searchTerm })}>
        <DishList>
          {results?.map(({ item: recipe }) => (
            <DishListItem
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
