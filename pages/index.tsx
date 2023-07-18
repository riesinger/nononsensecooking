import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import DishCard from "../components/DishCard";
import { PaddedSection } from "../components/PaddedSection";
import SEO from "../components/SEO";
import Track from "../components/Track";
import languageFrom from "../lib/languageFrom";
import { orderRecipesByMostPopular } from "../lib/popularRecipes";
import { getRecipesFromDiskOrIndex } from "../lib/recipes";
import { Recipe } from "../models/Recipe";

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
  const allRecipes = await getRecipesFromDiskOrIndex(locale);
  const recipesOfTheDay = shuffle(allRecipes)
    .filter((r: Recipe) => !r.isDraft)
    .slice(0, 3);
  const mostPopularRecipes = (
    await orderRecipesByMostPopular(locale, allRecipes)
  )
    .filter((r: Recipe) => !r.isDraft)
    .slice(0, 3);
  const latestRecipes = allRecipes.sort(byPublishedAt).slice(0, 3);

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "common",
        "footer",
        "header",
      ])),
      recipesOfTheDay,
      mostPopularRecipes,
      latestRecipes,
    },
    revalidate: REVALIDATION_TIME,
  };
};

export default function Home({
  recipesOfTheDay,
  mostPopularRecipes,
  latestRecipes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("common");
  return (
    <>
      <SEO />
      <PaddedSection title={t("home.todaysrecipes")} smallHeadings>
        <Track>
          {recipesOfTheDay.map((recipe: Recipe) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection title={t("home.mostpopularrecipes")} smallHeadings>
        <Track>
          {mostPopularRecipes.map((recipe: Recipe) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection title={t("home.latestrecipes")} smallHeadings>
        <Track>
          {latestRecipes.map((recipe: Recipe) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
      <section className="mt-12 lg:mt-24 mx-auto prose dark:prose-invert prose-neutral px-8 box-content">
        <h2>{t("home.about.sectiontitle")}</h2>
        <p>{t("home.about.introduction")}</p>
        <p>{t("home.about.mission")}</p>
        <p>
          <Trans
            i18nKey="home.about.cta"
            components={{
              rsslink: <Link href="/rss/" />,
              donatelink: <Link href="/donate/" />,
            }}
          ></Trans>
        </p>
      </section>
    </>
  );
}

function byPublishedAt(
  a: Pick<Recipe, "publishedAt">,
  b: Pick<Recipe, "publishedAt">,
) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}
