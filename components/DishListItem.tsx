import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { Recipe } from "../models/Recipe";
import IconForDiet from "./IconForDiet";

type Props = {
  id: Recipe["id"];
  slug: Recipe["slug"];
  name: Recipe["name"];
  image: Recipe["image"];
  cookTime: Recipe["cookTime"];
  diet: Recipe["diet"];
};

const DishListItem = ({ slug, name, image, cookTime, diet }: Props) => {
  const { t } = useTranslation("common");
  return (
    <Link
      className="relative flex flex-col lg:flex-row items-center overflow-hidden text-neutral-800 hover:text-neutral-900 dark:text-neutral-200 hover:dark:text-neutral-100 group gap-x-6 gap-y-4"
      href={`/r/${slug}`}
      prefetch={false}
    >
      <div className="w-full lg:max-w-[12rem] flex-shrink-0">
        <div className="flex-shrink-0 flex-grow-0 w-full relative aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
          <Image
            src={`/img/recipes/${image || "placeholder-min.jpg"}`}
            fill
            quality={60}
            sizes="(max-width: 775px) 600px, (min-width: 1024px) 160px"
            alt=""
            className="group-hover:scale-105 transition-transform duration-150 linear"
          />
        </div>
      </div>
      <div className="space-y-2 self-start lg:self-center">
        <h4 className="text-xl">{name}</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Icon
              path={mdiClockOutline}
              size={0.75}
              title={t("preparationTime.label")}
            />
            <span>{t("preparationTime.inMinutes", { minutes: cookTime })}</span>
          </div>
          <IconForDiet diet={diet} size={0.75} />
        </div>
      </div>
    </Link>
  );
};

export default DishListItem;
