import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { Recipe } from "../models/Recipe";
import IconForDiet from "./IconForDiet";

type Props = {
  slug: Recipe["slug"];
  name: Recipe["name"];
  image: Recipe["image"];
  cookTime: Recipe["cookTime"];
  diet: Recipe["diet"];
};

const StyledCard = styled(Link)`
  background: var(--color-background-alt);
  border-radius: var(--rounded-lg);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  display: block;

  img {
    transition: transform 0.15s linear;
  }

  :hover img {
    transform: scale(1.1);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 0;
  padding-top: 65%;
  position: relative;
`;

const DishStats = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  background: linear-gradient(
    0deg,
    hsla(var(--palette-gray-95), 80%) 0%,
    hsla(var(--palette-gray-95), 32%) 70%,
    hsla(var(--palette-gray-95), 0%) 100%
  );
  color: hsl(var(--palette-gray-00));
  z-index: 2;
  padding: 0.75rem 1rem;

  @media screen and (min-width: 600px) {
    padding: 1rem 2rem;
  }
`;

const DishName = styled.h4`
  margin: 0 0 1rem 0;
  font-weight: 400;

  font-size: 1.25rem;

  @media screen and (min-width: 600px) {
    font-size: 1.5rem;
  }
`;

const DishStatLine = styled.span`
  display: flex;
  align-items: center;
  gap: 1rem;

  font-size: 0.9rem;

  @media screen and (min-width: 600px) {
    font-size: 1rem;
  }
`;

const IconStat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DishCard = ({ slug, name, image, cookTime, diet }: Props) => {
  const { t } = useTranslation("common");
  return (
    <StyledCard href={`/r/${slug}`} passHref>
      <ImageContainer>
        <Image
          src={`/img/recipes/${image}`}
          fill
          quality={80}
          sizes="(max-width: 600px) 200px, (max-width: 1200px) 400px, (max-width: 1800px) 500, (max-width: 2400px) 600px, (min-width: 2401px) 700px"
          alt=""
        />
      </ImageContainer>
      <DishStats>
        <DishName>{name}</DishName>
        <DishStatLine>
          <IconStat>
            <Icon
              path={mdiClockOutline}
              size={1}
              title={t("preparationTime.label")}
            />
            <span>{t("preparationTime.inMinutes", { minutes: cookTime })}</span>
          </IconStat>
          <IconForDiet diet={diet} />
        </DishStatLine>
      </DishStats>
    </StyledCard>
  );
};

export default DishCard;
