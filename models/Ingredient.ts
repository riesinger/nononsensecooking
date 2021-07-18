import { Unit } from "./Unit";

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
