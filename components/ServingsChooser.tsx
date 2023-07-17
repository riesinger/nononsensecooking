import { mdiMinus, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";

interface Props {
  servings: number;
  onServingsChanged: (newServings: number) => void;
}

const ServingsChooser = ({ servings, onServingsChanged }: Props) => {
  const { t } = useTranslation("recipe");
  return (
    <div className="flex items-center gap-8">
      <h5 className="text-semibold text-xl">{t("servings")}</h5>
      <div className="flex items-center gap-4">
        <button
          className="appearance-none border-none bg-neutral-50 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full w-8 h-8 pl-1 ring-1 ring-neutral-950/20 dark:ring-neutral-50/20 shadow"
          onClick={function () {
            onServingsChanged(Math.max(1, servings - 1));
          }}
        >
          <Icon path={mdiMinus} size={1} title="Less servings" />
        </button>

        <span className="text-xl">{servings}</span>
        <button
          className="appearance-none border-none bg-neutral-50 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full w-8 h-8 pl-1 ring-1 ring-neutral-950/20 dark:ring-neutral-50/20 shadow"
          onClick={function () {
            onServingsChanged(servings + 1);
          }}
        >
          <Icon path={mdiPlus} size={1} title="More servings" />
        </button>
      </div>
    </div>
  );
};

export default ServingsChooser;
