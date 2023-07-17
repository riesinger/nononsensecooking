import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useState } from "react";
import DraftIndicator from "../../components/DraftIndicator";
import IconForDiet from "../../components/IconForDiet";
import IngredientsList from "../../components/IngredientsList";
import SEO from "../../components/SEO";
import ServingsChooser from "../../components/ServingsChooser";
import StepList from "../../components/StepList";
import languageFrom from "../../lib/languageFrom";
import {
  loadRecipesFromDisk,
  readSingleRecipeFromDisk,
} from "../../lib/recipes";
import { SupportedLanguage } from "../../models/Localized";
import { Recipe } from "../../models/Recipe";

export const getStaticProps: GetStaticProps<Recipe> = async (context) => {
  const { id } = context.params;
  const recipe = await readSingleRecipeFromDisk(languageFrom(context), id[0]);
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "header",
        "common",
        "recipe",
        "footer",
      ])),
      ...recipe,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  let paths = [];
  for (const locale of context.locales) {
    const recipes = await loadRecipesFromDisk(locale as SupportedLanguage);
    for (const recipe of recipes) {
      paths.push({
        params: {
          id: recipe.slug.split("/"),
        },
        locale,
      });
    }
  }
  return {
    paths,
    fallback: false, // NOTE: Once we have many recipes, it might be worth looking into only pre-rendering some of them
  };
};

const SingleRecipe = ({
  name,
  steps,
  image,
  diet,
  cookTime,
  ingredients,
  isDraft,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const DEFAULT_SERVINGS = 2;
  const [servings, setServings] = useState(DEFAULT_SERVINGS);
  function onServingsChanged(newServings: number) {
    setServings(newServings);
  }
  return (
    <article className="max-w-screen-lg w-full mt-12 mb-8 px-8 box-border space-y-8">
      <SEO isRecipe title={name} img={image} />
      {isDraft ? <DraftIndicator /> : null}
      <header className="flex items-center justify-start flex-wrap gap-x-4 gap-y-2 mb-8">
        <h2 className="text-2xl md:text-3xl">{name}</h2>
        <div className="flex items-center gap-1">
          <Icon path={mdiClockOutline} size={1} title="Preparation Time" />
          <span>{cookTime}min</span>
        </div>
        <IconForDiet diet={diet} />
      </header>
      <div className="w-full aspect-w-10 aspect-h-6 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <Image
          src={`/img/recipes/${image || "placeholder-min.jpg"}`}
          fill
          sizes="(max-width: 400px) 400px, (max-width: 600px) 600px, (max-width: 800px) 800px, (min-width: 801px) 900px"
          alt=""
        />
      </div>
      <ServingsChooser
        servings={servings}
        onServingsChanged={onServingsChanged}
      />
      <IngredientsList
        ingredients={ingredients}
        servingsMultiplier={servings / DEFAULT_SERVINGS}
      />
      <StepList steps={steps} />
    </article>
  );
};

export default SingleRecipe;
