import { mdiChefHat, mdiMenu, mdiPotSteamOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  position: relative;
`;

const StyledHeading = styled.h1`
  font-size: 1.3rem;
  margin: 0;
  font-weight: 400;
  margin-left: 0.75rem;
  display: none;

  @media screen and (min-width: 400px) {
    display: block;
  }

  @media screen and (min-width: 800px) {
    font-size: 1.5rem;
  }
`;

const HomeLink = styled.a`
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

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  max-width: 100%;
`;

const StyledLink = styled.a`
  color: var(--color-text-secondary);
  transition: color 0.1s linear;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: var(--color-primary);
  }
`;
const MenuButton = styled.button`
  outline: none;
  appearance: none;
  cursor: pointer;
  /* background: var(--color-primary); */
  background: none;
  border: none;
  /* color: var(--color-text-on-primary); */
  color: var(--color-text-primary);
  width: 3rem;
  height: 3rem;
  border-radius: var(--rounded);

  @media screen and (min-width: 950px) {
    display: none;
  }
`;

const Menu = styled.div<{ open: boolean }>`
  position: absolute;
  z-index: 200;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: var(--shadow);
  background: var(--color-background);
  padding: 2rem 2rem 2rem 2rem;
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: all 0.15s ease-in;
  transform: ${({ open }) => (open ? "scale(1)" : "scale(0.95)")};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform-origin: top center;

  @media screen and (min-width: 950px) {
    position: static;
    visibility: visible;
    pointer-events: all;
    padding: 0;
    opacity: 1;
    transform: scale(1);
    box-shadow: none;
    width: auto;
    top: 0%;
  }
`;

const Header = () => {
  const { t } = useTranslation("header");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    router.events.on("routeChangeStart", closeMenu);

    return () => {
      router.events.off("routeChangeStart", closeMenu);
    };
  }, [router]);

  return (
    <StyledHeader>
      <Link href="/" passHref>
        <HomeLink>
          <IconContainer>
            <Icon path={mdiChefHat} size={1.5} rotate={10} />
          </IconContainer>
          <StyledHeading>NoNonsenseCooking</StyledHeading>
        </HomeLink>
      </Link>
      <MenuButton onClick={toggleMenu}>
        <Icon path={mdiMenu} size={1} />
      </MenuButton>
      <Menu open={menuOpen}>
        <StyledNav>
          <Link href="/r" passHref prefetch={false}>
            <StyledLink>
              <Icon path={mdiPotSteamOutline} size={1} />
              <span>{t("link.allrecipes")}</span>
            </StyledLink>
          </Link>
          <SearchBar placeholder={t("searchbar.placeholder")} />
        </StyledNav>
      </Menu>
    </StyledHeader>
  );
};

export default Header;
