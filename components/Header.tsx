import { mdiChefHat } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import styled from "styled-components";
import SearchBar from "./SearchBar";

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
  margin-left: 0.75rem;

  @media screen and (min-width: 800px) {
    font-size: 1.5rem;
  }
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  max-width: 100%;
  cursor: pointer;
`;

const IconContainer = styled.div`
  background: var(--color-primary);
  width: 3rem;
  height: 3rem;
  border-radius: var(--rounded);
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsla(var(--palette-gray-00), 100%);
`;

const Header = () => {
  const { t } = useTranslation("header");
  return (
    <StyledHeader>
      <Link href="/" passHref>
        <StyledLink>
          <IconContainer>
            <Icon path={mdiChefHat} size={1.5} rotate={10} />
          </IconContainer>
          <StyledHeading>NoNonsenseCooking</StyledHeading>
        </StyledLink>
      </Link>
      <SearchBar placeholder={t("searchbar.placeholder")} />
    </StyledHeader>
  );
};

export default Header;
