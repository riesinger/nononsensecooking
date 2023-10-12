import { useTranslation } from "next-i18next";
import { Ingredient as IngredientModel } from "../models/Ingredient";
import { Unit } from "../models/Unit";

function unitUsesPlural(unit: Unit) {
  return {
    [Unit.NONE]: true,
    [Unit.GRAM]: false,
    [Unit.KILOGRAM]: false,
    [Unit.LITERS]: false,
    [Unit.MILILITERS]: false,
    [Unit.PIECE]: true,
    [Unit.TABLESPOONS]: false,
  }[unit];
}

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
    ? Math.round(amount * servingsMultiplier * 100) / 100
    : amount;
  const ingredientName = id
    ? t(`ingredient.${id}`, {
        count: unitUsesPlural(unit) ? adjustedAmount : 1,
      })
    : name;

  return (
    <span>
      {t(`unit.${unit}`, { amount: adjustedAmount })} {ingredientName}
    </span>
  );
};

export default Ingredient;
