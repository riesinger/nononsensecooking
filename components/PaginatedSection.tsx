import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { ReactNode } from "react";
import styled from "styled-components";

const StyledSection = styled.section`
  width: 100%;
  max-width: 2000px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Title = styled.h3`
  font-weight: normal;
`;

type Props = {
  title: string;
  children?: ReactNode;
  totalPages: number;
  currentPage: number;
  prevPageLink?: string;
  prevLinkEnabled: boolean;
  nextPageLink?: string;
  nextLinkEnabled: boolean;
};

const StyledLink = styled.a<{disabled: boolean}>`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({disabled}) => disabled ? "var(--color-background)": "var(--color-background-alt)"};
  border-radius: var(--rounded-full);
  display: inline-block;
  box-sizing: border-box;
  padding: 0.5rem;
  pointer-events: ${({disabled}) => disabled ? "none": "auto"};
`;

const CurrentPageIndicator = styled.span`
  margin: 0 1rem;
`;

const NavigationBar = styled.div`
  display: flex;
  align-items: center;
`;

export const PaginatedSection = ({
  title,
  children,
  currentPage,
  totalPages,
  prevPageLink,
  prevLinkEnabled,
  nextPageLink,
  nextLinkEnabled,
}: Props) => {
  const { t } = useTranslation('common');
  return (
    <StyledSection>
      <StyledHeader>
        <Title>{title}</Title>
        <NavigationBar>
          <Link href={prevPageLink} passHref scroll={false} prefetch={false}>
            <StyledLink disabled={!prevLinkEnabled}>
              <Icon path={mdiChevronLeft} size={1} title={t('home.previouspage')}/>
            </StyledLink>
          </Link>
          <CurrentPageIndicator>
            {t('home.pageindicator', { currentPage, totalPages })}
          </CurrentPageIndicator>
          <Link href={nextPageLink} passHref scroll={false} prefetch={false}>
            <StyledLink disabled={!nextLinkEnabled}>
              <Icon path={mdiChevronRight} size={1} title={t('home.nextpage')}/>
            </StyledLink>
          </Link>
        </NavigationBar>
      </StyledHeader>
      {children}
    </StyledSection>
  );
};
