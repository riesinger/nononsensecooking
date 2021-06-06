import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styled from "styled-components";
import DishCard from "../components/DishCard";
import Track from "../components/Track";
import languageFrom from "../utils/languageFrom";
import { recipesOfTheDayForLanguage } from "./api/recipes/recommended/for-today";

const PaddedSection = styled.section`
  width: 100%;
  max-width: 2000px;
  margin: 0 auto;
  padding: 0 4rem;
  box-sizing: border-box;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const recipesOfTheDay = await recipesOfTheDayForLanguage(
      languageFrom(context)
    );
    return {
      props: {
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
        <h3>Today's recipes</h3>
        <Track sm={1} md={2} lg={3}>
          {recipesOfTheDay?.map((recipe) => (
            <DishCard key={recipe.id} id={recipe.id} {...recipe} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection>
        <h3>Recently added</h3>
      </PaddedSection>
    </>
  );
}
