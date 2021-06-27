import {
  mdiAlphaVCircleOutline,
  mdiFish,
  mdiFoodSteak,
  mdiHelpCircleOutline,
  mdiLeaf,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import React from "react";
import { Recipe } from "../models/Recipe";

const IconForDiet = ({
  diet,
  size = 1,
}: {
  diet: Recipe["diet"];
  size?: number;
}) => {
  const { t } = useTranslation();
  switch (diet) {
    case "meat":
      return <Icon path={mdiFoodSteak} title={t(`diet.${diet}`)} size={size} />;
    case "fish":
      return <Icon path={mdiFish} title={t(`diet.${diet}`)} size={size} />;
    case "vegetarian":
      return (
        <Icon
          path={mdiAlphaVCircleOutline}
          title={t(`diet.${diet}`)}
          size={size}
        />
      );
    case "vegan":
      return <Icon path={mdiLeaf} title={t(`diet.${diet}`)} size={size} />;
    default:
      return (
        <Icon path={mdiHelpCircleOutline} title="UNKNOWN DIET" size={size} />
      );
  }
};

export default IconForDiet;
