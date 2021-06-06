import { NonScalingIngredient as NSI } from "../models/Ingredient";

const NonScalingIngredient = ({ name, unit, amount }: NSI) => (
  <>
    <span>
      {amount}
      {unit || ""}
    </span>
    <span> {name}</span>
  </>
);

export default NonScalingIngredient;
