import {
  mdiAlphaVCircleOutline,
  mdiFish,
  mdiFoodSteak,
  mdiHelpCircleOutline,
  mdiLeaf,
} from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { Recipe } from "../models/Recipe";

const ICONS = {
  meat: <Icon path={mdiFoodSteak} title="Contains meat" size={1} />,
  fish: <Icon path={mdiFish} title="Contains fish" size={1} />,
  vegetarian: (
    <Icon path={mdiAlphaVCircleOutline} title="Vegetarian" size={1} />
  ),
  vegan: <Icon path={mdiLeaf} title="Vegan" size={1} />,
};

const IconForDiet = ({ diet }: { diet: Recipe["diet"] }) => {
  return ICONS[diet];
};

export default IconForDiet;
