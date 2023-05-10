import PocketBase, { RecordListQueryParams } from "pocketbase";
import { FullRecipe, Ingredient, SlimRecipe, Step } from "../models/Recipe";
import { IngredientUsageDTO, RecipeDTO, StepDTO } from "./dtos";

const stepsBatchSize = 25;
const ingredientsBatchSize = 50;

function getPocketBase() {
  return new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_HOST);
}

async function getAllPaginatedItems<T>(
  collectionName: string,
  batchSize: number,
  options?: Partial<Pick<RecordListQueryParams, "filter" | "sort">>
): Promise<T[]> {
  const pb = getPocketBase();
  let page = 1;
  const items: T[] = [];

  const setOptions = Object.fromEntries(
    Object.entries(options || {}).filter(([, value]) => !!value)
  );

  while (page) {
    console.log("Fetching page", page);
    const response = await pb
      .collection(collectionName)
      .getList<T>(page, batchSize, setOptions);
    items.push(...response.items);
    console.log("Fetched page", page, "of", response.totalPages);
    if (response.totalPages <= page) {
      break;
    }
    page++;
  }
  return items;
}

function recipeDTOToRecipe(recipe: RecipeDTO): SlimRecipe {
  return {
    id: recipe.id,
    slug: recipe.slug,
    name: recipe.name,
    status: recipe.status,
    diet: recipe.diet,
    preparationTimeMinutes: recipe.preparationTime,
    type: recipe.type,
    imageUrl: recipe.image
      ? getPocketBase().getFileUrl(recipe, recipe.image)
      : null,
    writtenBy: recipe.writtenBy,
    locale: recipe.locale,
    createdAt: recipe.created,
    updatedAt: recipe.updated,
  };
}

function ingredientDTOToIngredient(ingredient: IngredientUsageDTO): Ingredient {
  return {
    id: ingredient.ingredientId,
    amount: ingredient.amount === 0 ? null : ingredient.amount,
    unit: ingredient.unit,
    scalesWithPortions: ingredient.scalesWithPortions,
  };
}

function stepDTOToStep(step: StepDTO): Step {
  return {
    stepIndex: step.stepIndex,
    text: step.text,
  };
}

/**
 * Retrieves all recipes (regardless of status) from the database.
 * This does not expand the ingredients and steps, only the basic recipe
 * information.
 */
export async function getAllRecipes({
  publishedOnly = false,
  locale,
}: {
  publishedOnly?: boolean;
  locale?: "en" | "de";
}): Promise<SlimRecipe[]> {
  const recipes = await getAllPaginatedItems<RecipeDTO>(
    publishedOnly ? "publishedRecipes" : "recipes",
    50,
    {
      filter: locale ? `locale = "${locale}"` : undefined,
    }
  );
  return recipes.map(recipeDTOToRecipe);
}

/**
 * Retrieves a singular recipe from the database.
 * This does not expand the ingredients and steps, only the basic recipe
 * information. If you need them, use @link getRecipeByIDWithStepsAndIngredients
 * instead.
 *
 * FIXME: Sanitize `id` before using it as filter parameter
 */
export async function getRecipeByID(id: string): Promise<SlimRecipe> {
  const pb = getPocketBase();
  const recipe = await pb.collection("recipes").getOne<RecipeDTO>(id);
  return recipeDTOToRecipe(recipe);
}

/**
 * Retrieves a singular recipe from the database.
 * This does expand the ingredients and steps. If you don't need them, use @link
 * getRecipeByID instead.
 */
export async function getRecipeByIDWithStepsAndIngredients(
  id: string
): Promise<FullRecipe> {
  const recipe = await getRecipeByID(id);
  const steps = await getAllPaginatedItems<StepDTO>("steps", stepsBatchSize, {
    filter: `recipe = "${id}"`,
    sort: "+stepIndex",
  });
  const ingredients = await getAllPaginatedItems<IngredientUsageDTO>(
    "ingredientUsages",
    ingredientsBatchSize,
    {
      filter: `recipe = "${id}"`,
    }
  );

  return {
    ...recipe,
    steps: steps.map(stepDTOToStep),
    ingredients: ingredients.map(ingredientDTOToIngredient),
  };
}
