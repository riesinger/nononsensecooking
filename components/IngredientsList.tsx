import { Recipe } from "../models/Recipe";
import Ingredient from "./Ingredient";

interface Props {
  ingredients: Recipe["ingredients"];
  servingsMultiplier: number;
}

const IngredientsList = ({ ingredients, servingsMultiplier }: Props) => (
  <div>
    <ul className="my-4 pr-[2ch] leading-8">
      {ingredients?.map((ingredient) => (
        <li key={ingredient.name || ingredient.id}>
          <Ingredient {...ingredient} servingsMultiplier={servingsMultiplier} />
        </li>
      ))}
    </ul>
  </div>
);

export default IngredientsList;
