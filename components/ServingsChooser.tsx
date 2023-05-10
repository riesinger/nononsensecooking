import { mdiMinus, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import IconButton from "./IconButton";

interface Props {
  servings: number;
  onServingsChanged: (newServings: number) => void;
}

const ServingsChooser = ({ servings, onServingsChanged }: Props) => {
  const { t } = useTranslation("recipe");
  return (
    <div className="flex items-center gap-8">
      <h5 className="font-medium text-xl">{t("servings")}</h5>
      <div className="flex gap-4 items-center">
        <IconButton
          onClick={function () {
            onServingsChanged(Math.max(1, servings - 1));
          }}
          icon={<Icon path={mdiMinus} size={1} title="Less servings" />}
          ariaLabel="Less servings"
        />
        <span className="text-xl">{servings}</span>
        <IconButton
          onClick={function () {
            onServingsChanged(servings + 1);
          }}
          icon={<Icon path={mdiPlus} size={1} title="More servings" />}
          ariaLabel="More servings"
        />
      </div>
    </div>
  );
};

export default ServingsChooser;
