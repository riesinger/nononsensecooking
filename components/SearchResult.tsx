import Link from "next/link";
import styled from "styled-components";
import { Recipe } from "../models/Recipe";
import IconForDiet from "./IconForDiet";

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface Props {
  name: string;
  slug: string;
  diet: Recipe["diet"];
}

function getHref(slug: string) {
  return `/r/${slug}`;
}

const StyledLi = styled.li`
  margin: 1rem 0;
`;

const SearchResult = ({ slug, name, diet }: Props) => (
  <StyledLi>
    <Link href={getHref(slug)} passHref>
      <StyledLink>
        <IconForDiet diet={diet} />
        <span>{name}</span>
      </StyledLink>
    </Link>
  </StyledLi>
);

export default SearchResult;
