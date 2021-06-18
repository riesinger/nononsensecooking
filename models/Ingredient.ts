import { Localized } from "./Localized";
import { Unit } from "./Unit";

export interface TranslatableIngredientBase {
  scales: boolean;
  unit?: Unit;
  amount?: number;
}

export interface TranslatableIngredientWithNames
  extends TranslatableIngredientBase {
  name: Localized<string>;
}

export interface TranslatableIngredientWithID
  extends TranslatableIngredientBase {
  id: string;
}

export type TranslatableIngredient =
  | TranslatableIngredientWithNames
  | TranslatableIngredientWithID;

export function isTranslatableIngredientWithID(
  ingredient: TranslatableIngredient
): ingredient is TranslatableIngredientWithID {
  return (ingredient as TranslatableIngredientWithID)?.id !== undefined;
}

export interface IngredientBase {
  name?: string;
  id?: string;
  unit?: Unit;
}

export interface NonScalingIngredient extends IngredientBase {
  scales?: false;
  amount?: number;
}

export interface ScalingIngredient extends IngredientBase {
  scales: true;
  amount: number;
}

export type Ingredient = NonScalingIngredient | ScalingIngredient;

export function isScalingIngredient(
  ingredient: Ingredient
): ingredient is ScalingIngredient {
  return ingredient.scales === true;
}
