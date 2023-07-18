import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { Recipe } from "../models/Recipe";
import IconForDiet from "./IconForDiet";

type Props = {
  slug: Recipe["slug"];
  name: Recipe["name"];
  image: Recipe["image"];
  cookTime: Recipe["cookTime"];
  diet: Recipe["diet"];
};

const DishCard = ({ slug, name, image, cookTime, diet }: Props) => {
  const { t } = useTranslation("common");
  return (
    <Link
      className="bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer overflow-hidden relative group"
      href={`/r/${slug}`}
    >
      <div className="w-full aspect-w-3 aspect-h-2">
        <Image
          src={`/img/recipes/${image}`}
          fill
          quality={80}
          sizes="(max-width: 600px) 200px, (max-width: 1200px) 400px, (max-width: 1800px) 500, (max-width: 2400px) 600px, (min-width: 2401px) 700px"
          alt=""
          className="group-hover:scale-105 transition-transform duration-150 linear"
        />
      </div>
      <div className="w-full absolute bottom-0 text-neutral-100 z-10 py-3 px-4 bg-gradient-to-t from-neutral-950/80 via-70% via-neutral-950/40 to-transparent space-y-4">
        <h4 className="text-2xl md:text-xl">{name}</h4>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Icon
              path={mdiClockOutline}
              size={1}
              title={t("preparationTime.label")}
            />
            <span>{t("preparationTime.inMinutes", { minutes: cookTime })}</span>
          </div>
          <IconForDiet diet={diet} />
        </div>
      </div>
    </Link>
  );
};

export default DishCard;
