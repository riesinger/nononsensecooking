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

const IconForDiet = ({ diet }: { diet: Recipe["diet"] }) => {
  const { t } = useTranslation();
  switch (diet) {
    case "meat":
      return <Icon path={mdiFoodSteak} title={t(`diet.${diet}`)} size={1} />;
    case "fish":
      return <Icon path={mdiFish} title={t(`diet.${diet}`)} size={1} />;
    case "vegetarian":
      return (
        <Icon
          path={mdiAlphaVCircleOutline}
          title={t(`diet.${diet}`)}
          size={1}
        />
      );
    case "vegan":
      return <Icon path={mdiLeaf} title={t(`diet.${diet}`)} size={1} />;
  }
};

export default IconForDiet;
