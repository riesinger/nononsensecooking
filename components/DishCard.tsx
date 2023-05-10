import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { SlimRecipe } from "../models/Recipe";
import IconForDiet from "./IconForDiet";

// The z-index is set to 0 to fix a Safari bug where the image would be
// overflowing when resizing it: https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
const DishCard = ({
  slug,
  id,
  name,
  imageUrl,
  preparationTimeMinutes,
  diet,
}: Pick<
  SlimRecipe,
  "slug" | "id" | "name" | "imageUrl" | "preparationTimeMinutes" | "diet"
>) => {
  const { t } = useTranslation("common");
  return (
    <Link
      href={`/r/${id}/${slug}`}
      passHref
      className="rounded-lg cursor-pointer overflow-hidden relative block bg-[--color-backgound-alt] z-0"
    >
      <div className="w-full h-0 pt-[65%] relative">
        <Image
          src={imageUrl}
          fill
          quality={80}
          sizes="(max-width: 600px) 300px, (max-width: 1200px) 400px, (max-width: 1800px) 500px, (max-width: 2400px) 600px, (min-width: 2401px) 700px"
          alt=""
          className="transition-transform hover:scale-110"
        />
      </div>
      <div className="w-full absolute bottom-0 text-[hsl(var(--palette-gray-00))] z-10 py-3 px-4 md:py-4 md:px-8 from-gray-950/80 via-gray-900/32 via-70% to-transparent  bg-gradient-to-t">
        <h4 className="mb-4 font-normal text-xl md:text-2xl">{name}</h4>
        <div className="flex items-center gap-4 text-sm md:text-base">
          <div className="flex items-center gap-1">
            <Icon
              path={mdiClockOutline}
              size={1}
              title={t("preparationTime.label")}
            />
            <span>
              {t("preparationTime.inMinutes", {
                minutes: preparationTimeMinutes,
              })}
            </span>
          </div>
          <IconForDiet diet={diet} />
        </div>
      </div>
    </Link>
  );
};

export default DishCard;
