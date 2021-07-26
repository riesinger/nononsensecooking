import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishCard from "../components/DishCard";
import { PaddedSection } from "../components/PaddedSection";
import SEO from "../components/SEO";
import Track from "../components/Track";
import { Recipe, RecipeInIndex } from "../models/Recipe";
import languageFrom from "../utils/languageFrom";
import { orderRecipesByMostPopular } from "../utils/popularRecipes";
import { fetchRecipeIndex, loadRecipesFromDisk } from "../utils/recipes";

const revalidationTimesInSeconds = {
  development: 60,
  preview: 2 * 60,
  default: 26 * 60 * 60,
};

const REVALIDATION_TIME =
  revalidationTimesInSeconds[process.env.VERCEL_ENV || "default"];

function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = languageFrom(context);

  let allRecipes: Array<Recipe | RecipeInIndex> = [];
  try {
    allRecipes = await loadRecipesFromDisk(locale);
  } catch (err) {
    if (err.code === "ENOENT") {
      // We're running in ISR mode and regenerating the page in a lambda.
      // Load the recipe index via HTTP in this case.
      // This is not the nicest workaround, but since we cannot use HTTP to fetch the index at SSG time and cannot read the files from disk at ISR time,
      // we either have to do it this way or switch to an actual CMS
      allRecipes = await fetchRecipeIndex(locale);
    } else {
      throw err;
    }
  }
  const recipesOfTheDay = shuffle(allRecipes).slice(0, 3);
  const mostPopularRecipes = await orderRecipesByMostPopular(
    locale,
    allRecipes
  );

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "common",
        "footer",
        "header",
      ])),
      recipesOfTheDay,
      mostPopularRecipes,
    },
    revalidate: REVALIDATION_TIME,
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
