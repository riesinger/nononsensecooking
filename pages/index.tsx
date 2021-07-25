import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishCard from "../components/DishCard";
import { PaddedSection } from "../components/PaddedSection";
import SEO from "../components/SEO";
import Track from "../components/Track";
import { Recipe } from "../models/Recipe";
import languageFrom from "../utils/languageFrom";
import { fetchMostPopularRecipes } from "../utils/popularRecipes";
import { fetchRecipeIndex } from "../utils/recipes";

const ALL_RECIPES_PAGE_SIZE = 10;

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = languageFrom(context);
  const recipeIndex = await fetchRecipeIndex(locale);
  // TODO: Re-implement a proper recipes-of-the-day functionality
  const recipesOfTheDay = recipeIndex.slice(0, 3);
  const mostPopularRecipes = await fetchMostPopularRecipes(locale);

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "common",
        "footer",
        "header",
      ])),
      recipesOfTheDay,
      paginatedRecipes: [],
      mostPopularRecipes,
    },
    revalidate: 24 * 60 * 60, // One day in seconds
  };
};

export default function Home({
  recipesOfTheDay,
  mostPopularRecipes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("common");
  return (
    <>
      <SEO />
      <PaddedSection title={t("home.todaysrecipes")}>
        <Track sm={1} md={2} lg={3}>
          {recipesOfTheDay.map((recipe: Recipe) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection title={t("home.mostpopularrecipes")}>
        <Track sm={1} md={2} lg={3}>
          {mostPopularRecipes.map((recipe: Recipe) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
    </>
  );
}
