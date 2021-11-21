import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishList from "../components/DishList";
import DishListItem from "../components/DishListItem";
import { PaddedSection } from "../components/PaddedSection";
import SEO from "../components/SEO";
import languageFrom from "../lib/languageFrom";
import { loadRecipesFromDisk } from "../lib/recipes";
import { Recipe } from "../models/Recipe";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = languageFrom(context);
  const recipeIndex = await loadRecipesFromDisk(locale);

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "common",
        "footer",
        "header",
      ])),
      recipes: recipeIndex,
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
          {recipes
            .filter((r: Recipe) => !r.isDraft)
            .map((recipe: Recipe) => (
              <DishListItem
                key={recipe.id}
                id={recipe.id}
                slug={recipe.slug}
                {...recipe}
              />
            ))}
        </DishList>
      </PaddedSection>
    </>
  );
}
