import { mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import { Ingredient as IIngredient } from "../models/Recipe";
import { Unit } from "../models/Unit";
import IconButton from "./IconButton";
import Ingredient from "./Ingredient";

interface Props {
  ingredients: IIngredient[];
  servingsMultiplier: number;
  onDelete?: (id: string) => void;
}

function IngredientsList({ ingredients, servingsMultiplier, onDelete }: Props) {
  const { t } = useTranslation("common");
  if (!ingredients || ingredients.length === 0) return null;
  return (
    <div>
      <ul className="p-0 m-0 leading-8 list-disc">
        {ingredients?.map(({ id, amount, unit, scalesWithPortions }) => (
          <li key={id} className="flex items-center">
            <Ingredient
              amount={amount}
              unit={unit as Unit}
              scalesWithPortions={scalesWithPortions}
              id={id}
              servingsMultiplier={servingsMultiplier}
            />
            {onDelete ? (
              <IconButton
                icon={<Icon size={0.75} path={mdiTrashCanOutline} />}
                variant="ghost"
                colorScheme="negative"
                ariaLabel={t("new.ingredientssection.deletebutton")}
                onClick={() => onDelete(id)}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientsList;
