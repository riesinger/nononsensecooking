import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styled from "styled-components";
import DishCard from "../components/DishCard";
import Track from "../components/Track";
import languageFrom from "../utils/languageFrom";
import { recipesOfTheDayForLanguage } from "./api/recipes/recommended/for-today";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const PaddedSection = styled.section`
  width: 100%;
  max-width: 2000px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const recipesOfTheDay = await recipesOfTheDayForLanguage(
      languageFrom(context)
    );
    return {
      props: {
        ...(await serverSideTranslations(context.locale, [
          "common",
          "footer",
          "header",
        ])),
        recipesOfTheDay,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};

export default function Home({
  recipesOfTheDay,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>NoNonsenseCooking</title>
        <meta
          name="description"
          content="Curated, no-nonsense recipes for delicious meals"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PaddedSection>
        <h3>{t("home.todaysrecipes")}</h3>
        <Track sm={1} md={2} lg={3}>
          {recipesOfTheDay?.map((recipe) => (
            <DishCard key={recipe.id} id={recipe.id} {...recipe} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection>
        <h3>{t("home.recentlyaddedrecipes")}</h3>
      </PaddedSection>
    </>
  );
}
