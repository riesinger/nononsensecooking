import { useTranslation } from "next-i18next";
import { ScalingIngredient as SI } from "../models/Ingredient";

const ScalingIngredient = ({
  name,
  unit,
  amount,
  servingsMultiplier,
}: SI & { servingsMultiplier: number }) => {
  const { t } = useTranslation("recipe");
  return (
    <>
      <span>
        {t(`unit.${unit}`, {
          amount: Math.round(amount * servingsMultiplier * 10) / 10,
        })}
      </span>
      <span> {name}</span>
    </>
  );
};

export default ScalingIngredient;
