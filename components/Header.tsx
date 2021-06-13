import { mdiChefHat } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";
import styled from "styled-components";

const StyledHeader = styled.header`
  padding: 1rem 2rem;
  margin: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const StyledHeading = styled.h1`
  font-size: 1.3rem;
  margin: 0;
  font-weight: 400;
  margin-right: 0.5rem;

  @media screen and (min-width: 800px) {
    font-size: 1.5rem;
  }
`;

const SearchBar = styled.input`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  color: var(--color-text-primary);
  width: 40ch;
  max-width: 100%;
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const Header = () => (
  <StyledHeader>
    <Link href="/">
      <StyledLink>
        <StyledHeading>NoNonsenseCooking</StyledHeading>
        <Icon path={mdiChefHat} size={1.5} rotate={10} />
      </StyledLink>
    </Link>
    <SearchBar placeholder="Search for recipes and ingredients" />
  </StyledHeader>
);

export default Header;
