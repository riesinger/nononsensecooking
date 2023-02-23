import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
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

const HEIGHT = 8; //rem

const Dish = styled.a`
  position: relative;
  flex-direction: column;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: var(--color-text-primary);

  img {
    transition: transform 0.15s linear;
  }

  :hover img {
    transform: scale(1.1);
  }

  @media screen and (min-width: 500px) {
    height: ${HEIGHT}rem;
    flex-direction: row;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  padding-top: 64.577792124%;
  height: 0;
  position: relative;
  overflow: hidden;
  border-radius: var(--rounded);
  background: var(--color-background-alt);
  flex: 0 0 auto;

  @media screen and (min-width: 500px) {
    width: ${HEIGHT * 1.539}rem;
    height: ${HEIGHT}rem;
    padding-top: 0;
  }
`;

const DishStats = styled.div`
  width: 100%;
  bottom: 0;
  z-index: 2;
  padding: 1rem 0rem;

  @media screen and (min-width: 500px) {
    padding: 1rem 2rem;
  }
`;

const DishName = styled.h4`
  margin: 0 0 1rem 0;
  font-weight: 400;
  font-size: 1.25rem;
`;

const DishStatLine = styled.span`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconStat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DishListItem = ({ slug, name, image, cookTime, diet }: Props) => {
  const { t } = useTranslation("common");
  return (
    <Link href={`/r/${slug}`} passHref prefetch={false}>
      <Dish>
        <ImageContainer>
          <Image
            src={`/img/recipes/${image || "placeholder-min.jpg"}`}
            fill
            quality={60}
            sizes="(max-width: 600px) 100px, (min-width: 601px) 160px"
            alt=""
          />
        </ImageContainer>
        <DishStats>
          <DishName>{name}</DishName>
          <DishStatLine>
            <IconStat>
              <Icon
                path={mdiClockOutline}
                size={0.75}
                title={t("preparationTime.label")}
              />
              <span>
                {t("preparationTime.inMinutes", { minutes: cookTime })}
              </span>
            </IconStat>
            <IconForDiet diet={diet} size={0.75} />
          </DishStatLine>
        </DishStats>
      </Dish>
    </Link>
  );
};

export default DishListItem;
