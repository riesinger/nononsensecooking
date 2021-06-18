import { useTranslation } from "react-i18next";
import {
  Ingredient as IngredientModel,
  isScalingIngredient,
} from "../models/Ingredient";

const Ingredient = ({
  id,
  name,
  scales,
  unit,
  amount,
  servingsMultiplier,
}: IngredientModel & { servingsMultiplier: number }) => {
  const { t } = useTranslation("recipe");
  const adjustedAmount = scales
    ? Math.round(amount * servingsMultiplier * 10) / 10
    : amount;
  const ingredientName = id
    ? t(`ingredient.${id}${adjustedAmount > 1 ? "_plural" : ""}`)
    : name;

  return (
    <span>
      {t(`unit.${unit}`, { amount: adjustedAmount })} {ingredientName}
    </span>
  );
};

export default Ingredient;
