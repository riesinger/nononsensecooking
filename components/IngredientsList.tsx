import { isScalingIngredient } from "../models/Ingredient";
import { Recipe } from "../models/Recipe";
import NonScalingIngredient from "./NonScalingIngredient";
import ScalingIngredient from "./ScalingIngredient";

interface Props {
  ingredients: Recipe["ingredients"];
  servingsMultiplier: number;
}

const IngredientsList = ({ ingredients, servingsMultiplier }: Props) => (
  <div>
    <ul>
      {ingredients.map((ingredient) => (
        <li key={ingredient.name}>
          {isScalingIngredient(ingredient) ? (
            <ScalingIngredient
              {...ingredient}
              servingsMultiplier={servingsMultiplier}
            />
          ) : (
            <NonScalingIngredient {...ingredient} />
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default IngredientsList;
