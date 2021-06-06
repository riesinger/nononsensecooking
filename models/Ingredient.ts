import { Localized } from "./Localized";
import { Unit } from "./Unit";

export interface TranslatableIngredient {
  name: Localized<string>;
  scales: boolean;
  unit?: Unit;
  amount: number;
}

export type Ingredient = NonScalingIngredient | ScalingIngredient;

export type NonScalingIngredient = {
  name: string;
  scales?: false;
  unit?: Unit;
  amount: number;
};

export type ScalingIngredient = {
  name: string;
  scales: true;
  unit: Unit;
  amount: number;
};

export function isScalingIngredient(
  ingredient: Ingredient
): ingredient is ScalingIngredient {
  return ingredient.scales === true;
}
