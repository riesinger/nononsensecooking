import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import DishCard from "../components/DishCard";
import DishList from "../components/DishList";
import DishListItem from "../components/DishListItem";
import { PaddedSection } from "../components/PaddedSection";
import { PaginatedSection } from "../components/PaginatedSection";
import SEO from "../components/SEO";
import Track from "../components/Track";
import { usePagination } from "../hooks/usePagination";
import { useQueryParam } from "../hooks/useQueryParam";
import { Recipe } from "../models/Recipe";
import languageFrom from "../utils/languageFrom";
import { paginatedRecipesForLanguage } from "./api/recipes";
import { recipesOfTheDayForLanguage } from "./api/recipes/recommended/for-today";

const ALL_RECIPES_PAGE_SIZE = 10;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const recipesOfTheDay = await recipesOfTheDayForLanguage(
    languageFrom(context)
  );
  const start = parseInt(useQueryParam(context, "start", 0), 10);
  const paginatedRecipesResult = await paginatedRecipesForLanguage(
    languageFrom(context),
    start,
    ALL_RECIPES_PAGE_SIZE
  );
  const { totalPages, currentPage, items } = usePagination<Recipe>(
    paginatedRecipesResult,
    ALL_RECIPES_PAGE_SIZE,
    start
  );

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "common",
        "footer",
        "header",
      ])),
      recipesOfTheDay,
      paginatedRecipes: items,
      totalRecipes: paginatedRecipesResult.totalItems,
      totalPages,
      currentPage,
    },
  };
};

export default function Home({
  recipesOfTheDay,
  paginatedRecipes,
  totalPages,
  currentPage,
  totalRecipes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const start = parseInt(useQueryParam(router, "start", 0), 10);
  const nextPageLink = `/?start=${start + ALL_RECIPES_PAGE_SIZE >= totalRecipes ? start : start + ALL_RECIPES_PAGE_SIZE}`;
  const nextLinkEnabled = start + ALL_RECIPES_PAGE_SIZE < totalRecipes;
  const prevPageLink = `/?start=${Math.max(
    0,
    start - ALL_RECIPES_PAGE_SIZE
  )}`;
  const prevLinkEnabled = start > 0;
  return (
    <>
      <SEO />
      <PaddedSection title={t("home.todaysrecipes")}>
        <Track sm={1} md={2} lg={3}>
          {recipesOfTheDay.map((recipe: Recipe) => (
            <DishCard key={recipe.id} id={recipe.id} {...recipe} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection title={t("home.recentlyaddedrecipes")}></PaddedSection>
      <PaginatedSection
        title={t("home.allrecipes")}
        totalPages={totalPages}
        currentPage={currentPage}
        prevPageLink={prevPageLink}
        prevLinkEnabled={prevLinkEnabled}
        nextPageLink={nextPageLink}
        nextLinkEnabled={nextLinkEnabled}
      >
        <DishList>
          {paginatedRecipes.map((recipe: Recipe) => (
            <DishListItem key={recipe.id} id={recipe.id} {...recipe} />
          ))}
        </DishList>
      </PaginatedSection>
    </>
  );
}
