import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishCard from "../components/DishCard";
import Link from "../components/Link";
import { PaddedSection } from "../components/PaddedSection";
import Paragraph from "../components/Paragraph";
import SEO from "../components/SEO";
import Track from "../components/Track";
import languageFrom from "../lib/localeFrom";
import { orderRecipesByMostPopular } from "../lib/popularRecipes";
import { getAllRecipes } from "../lib/recipes";
import { SlimRecipe } from "../models/Recipe";

const revalidationTimesInSeconds = {
  development: 60, // 1 minute
  preview: 2 * 60, // 2 minutes
  default: 24 * 60 * 60, // Once a day
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
  const allRecipes = await getAllRecipes({ publishedOnly: true, locale });
  const recipesOfTheDay = shuffle(allRecipes).slice(0, 3);
  const mostPopularRecipes = (
    await orderRecipesByMostPopular(locale, allRecipes)
  ).slice(0, 3);
  const latestRecipes = allRecipes.sort(byPublishedAt).slice(0, 3);

  console.log(allRecipes);

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common"])),
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
          {recipesOfTheDay.map((recipe: SlimRecipe) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection title={t("home.mostpopularrecipes")} smallHeadings>
        <Track>
          {mostPopularRecipes.map((recipe: SlimRecipe) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection title={t("home.latestrecipes")} smallHeadings>
        <Track>
          {latestRecipes.map((recipe: SlimRecipe) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection
        width="narrow"
        title={t("home.about.sectiontitle")}
        smallHeadings
      >
        <Paragraph>{t("home.about.introduction")}</Paragraph>
        <Paragraph>{t("home.about.mission")}</Paragraph>
        <Paragraph>
          <Trans
            i18nKey="home.about.cta"
            components={{
              rsslink: <Link href="/rss/" />,
              donatelink: <Link href="/donate/" />,
            }}
          ></Trans>
        </Paragraph>
      </PaddedSection>
    </>
  );
}

function byPublishedAt(
  a: Pick<SlimRecipe, "createdAt">,
  b: Pick<SlimRecipe, "createdAt">
) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}
