import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import { useState } from "react";
import DraftIndicator from "../../components/DraftIndicator";
import IconForDiet from "../../components/IconForDiet";
import IngredientsList from "../../components/IngredientsList";
import SEO from "../../components/SEO";
import ServingsChooser from "../../components/ServingsChooser";
import StepList from "../../components/StepList";
import {
  getAllRecipes,
  getRecipeByIDWithStepsAndIngredients,
} from "../../lib/recipes";
import { FullRecipe } from "../../models/Recipe";

export const getStaticProps: GetStaticProps<
  FullRecipe & {
    imagePlaceholder: string;
  }
> = async (context) => {
  const { id } = context.params;
  const recipe = await getRecipeByIDWithStepsAndIngredients(id[0]);
  const { base64: imagePlaceholder } = await getPlaiceholder(recipe.imageUrl);
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common", "recipe"])),
      ...recipe,
      imagePlaceholder,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  let paths = [];
  const recipes = await getAllRecipes({ publishedOnly: true });

  for (const locale of context.locales) {
    console.log("building index for locale", locale);
    const recipesInLocale = recipes.filter((r) => r.locale === locale);
    for (const recipe of recipesInLocale) {
      paths.push({
        params: {
          id: [recipe.id, recipe.slug],
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
  imageUrl,
  diet,
  preparationTimeMinutes,
  ingredients,
  status,
  type,
  imagePlaceholder,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const DEFAULT_SERVINGS = 2;
  const [servings, setServings] = useState(DEFAULT_SERVINGS);
  function onServingsChanged(newServings: number) {
    setServings(newServings);
  }
  const { t } = useTranslation("recipe");
  return (
    <article className="max-w-screen-lg w-full my-8 mx-auto px-8 box-border">
      <SEO isRecipe title={name} img={imageUrl} />
      {status === "draft" ? <DraftIndicator /> : null}
      <header className="flex items-center justify-start flex-wrap gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl text-zinc-900 dark:text-zinc-100 font-medium mr-4">
          {name}
        </h2>
        <div className="flex items-center gap-1">
          <Icon path={mdiClockOutline} size={1} title="Preparation Time" />
          <span>{preparationTimeMinutes}min</span>
        </div>
        <IconForDiet diet={diet} />
      </header>
      <div className="w-full h-0 pt-[65%] relative rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 mb-8">
        <Image
          src={imageUrl}
          fill
          sizes="(max-width: 400px) 400px, (max-width: 600px) 600px, (max-width: 800px) 800px, (min-width: 801px) 900px"
          alt=""
          placeholder="blur"
          blurDataURL={imagePlaceholder}
          priority
        />
      </div>
      <ServingsChooser
        servings={servings}
        onServingsChanged={onServingsChanged}
      />
      <h3 className="mt-4 mb-1 text-xl font-medium">
        {t("ingredient-title_plural")}
      </h3>
      <IngredientsList
        ingredients={ingredients}
        servingsMultiplier={servings / DEFAULT_SERVINGS}
      />
      <h3 className="mt-4 mb-1 text-xl font-medium">
        {t("preparation-title")}
      </h3>
      <StepList steps={steps} />
    </article>
  );
};

export default SingleRecipe;
