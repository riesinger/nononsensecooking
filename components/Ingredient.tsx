import { useTranslation } from "react-i18next";
import { Ingredient as IngredientModel, Unit } from "../models/Recipe";

function unitUsesPlural(unit: Unit) {
  return {
    none: true,
    g: false,
    kg: false,
    l: false,
    ml: false,
    pc: true,
    tbsp: false,
  }[unit];
}

const Ingredient = ({
  id,
  scalesWithPortions,
  unit,
  amount,
  servingsMultiplier,
}: IngredientModel & { servingsMultiplier: number }) => {
  const { t } = useTranslation("recipe");
  const adjustedAmount = scalesWithPortions
    ? Math.round(amount * servingsMultiplier * 100) / 100
    : amount;
  const ingredientName = t(`ingredient.${id}`, {
    count: unitUsesPlural(unit as Unit) ? adjustedAmount : 1,
  });

  return (
    <span>
      {t(`unit.${unit}`, { amount: adjustedAmount })} {ingredientName}
    </span>
  );
};

export default Ingredient;
