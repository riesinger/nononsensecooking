import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishCard from "../components/DishCard";
import DishListItem from "../components/DishListItem";
import { PaddedSection } from "../components/PaddedSection";
import SEO from "../components/SEO";
import Track from "../components/Track";
import { Recipe } from "../models/Recipe";
import languageFrom from "../utils/languageFrom";
import { paginatedRecipesForLanguage } from "./api/recipes";
import { recipesOfTheDayForLanguage } from "./api/recipes/recommended/for-today";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const recipesOfTheDay = await recipesOfTheDayForLanguage(
    languageFrom(context)
  );
  const allRecipes = await paginatedRecipesForLanguage(
    languageFrom(context),
    0,
    50
  );
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "common",
        "footer",
        "header",
      ])),
      recipesOfTheDay,
      allRecipes,
    },
  };
};

export default function Home({
  recipesOfTheDay,
  allRecipes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
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
      <PaddedSection title={t("home.allrecipes")}>
        {allRecipes.map((recipe: Recipe) => (
          <DishListItem key={recipe.id} id={recipe.id} {...recipe} />
        ))}
      </PaddedSection>
    </>
  );
}
