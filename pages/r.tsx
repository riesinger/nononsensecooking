import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishCard from "../components/DishCard";
import DishList from "../components/DishList";
import { PaddedSection } from "../components/PaddedSection";
import SEO from "../components/SEO";
import localeFrom from "../lib/localeFrom";
import { getAllRecipes } from "../lib/recipes";
import { SlimRecipe } from "../models/Recipe";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = localeFrom(context);
  const recipes = await getAllRecipes({ publishedOnly: true, locale });

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common"])),
      recipes: recipes,
    },
  };
};

export default function Home({
  recipes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("common");

  return (
    <>
      <SEO title={t("home.allrecipes")} />
      <PaddedSection title={t("home.allrecipes")} smallHeadings>
        <DishList>
          {recipes.map((recipe: SlimRecipe) => (
            <DishCard key={recipe.id} {...recipe} />
          ))}
        </DishList>
      </PaddedSection>
    </>
  );
}
