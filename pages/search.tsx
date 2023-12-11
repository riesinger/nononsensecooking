import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishList from "../components/DishList";
import DishListItem from "../components/DishListItem";
import SEO from "../components/SEO";
import SearchBar from "../components/SearchBar";
import languageFrom from "../lib/languageFrom";
import { queryParam } from "../lib/queryParameter";
import { sanitize, searchRecipes } from "./api/search";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const unsanitizedSearchTerm = queryParam("query").from(context);
  if (!unsanitizedSearchTerm) {
    return {
      props: {
        searchTerm: "",
        results: [],
        ...(await serverSideTranslations(
          context.locale ?? context.defaultLocale!,
          ["common", "header", "footer"],
        )),
      },
    };
  }
  const searchTerm = sanitize(unsanitizedSearchTerm);
  const results = await searchRecipes(languageFrom(context), searchTerm);
  return {
    props: {
      searchTerm,
      results,
      ...(await serverSideTranslations(
        context.locale ?? context.defaultLocale!,
        ["common", "header", "footer"],
      )),
    },
  };
};

export default function Search({
  searchTerm,
  results,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
  const { t: th } = useTranslation("header");
  if (!searchTerm) {
    return (
      <>
        <SEO title={t("search.pagetitle")} />
        <section className="flex justify-center align-center flex-col gap-8 w-full max-w-screen-md mt-[25vh] mx-auto px-8 box-border">
          <p className="text-center text-2xl">{t("search.findrecipes")}</p>
          <SearchBar placeholder={th("searchbar.placeholder")} />
        </section>
      </>
    );
  }
  return (
    <>
      <SEO title={t("search.pagetitle")} />
      <div className="px-8 box-content">
        <div className="prose dark:prose-invert prose-neutral">
          <h1 className="mb-4">{t("search.sectiontitle", { searchTerm })}</h1>
        </div>
        <section>
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
        </section>
      </div>
    </>
  );
}
