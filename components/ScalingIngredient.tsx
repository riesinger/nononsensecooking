import { ScalingIngredient as SI } from "../models/Ingredient";

const ScalingIngredient = ({
  name,
  unit,
  amount,
  servingsMultiplier,
}: SI & { servingsMultiplier: number }) => (
  <>
    <span>
      {Math.round(amount * servingsMultiplier * 10) / 10}
      {unit}
    </span>
    <span> {name}</span>
  </>
);

export default ScalingIngredient;
