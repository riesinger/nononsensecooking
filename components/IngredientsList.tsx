import { isScalingIngredient } from "../models/Ingredient";
import { Recipe } from "../models/Recipe";
import NonScalingIngredient from "./NonScalingIngredient";
import ScalingIngredient from "./ScalingIngredient";
import styled from "styled-components";
import Ingredient from "./Ingredient";

interface Props {
  ingredients: Recipe["ingredients"];
  servingsMultiplier: number;
}

const List = styled.ul`
  margin: 1rem 0;
  padding: 0 0 0 2ch;
  line-height: 2rem;
`;

const IngredientsList = ({ ingredients, servingsMultiplier }: Props) => (
  <div>
    <List>
      {ingredients.map((ingredient) => (
        <li key={ingredient.name || ingredient.id}>
          <Ingredient {...ingredient} servingsMultiplier={servingsMultiplier} />
        </li>
      ))}
    </List>
  </div>
);

export default IngredientsList;
