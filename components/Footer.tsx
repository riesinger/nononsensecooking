import { mdiRss } from "@mdi/js";
import Icon from "@mdi/react";
import { Trans, useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

const StyledFooter = styled.footer`
  margin-top: 2rem;
  padding: 1rem 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  @media screen and (max-width: 800px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const StyledLink = styled(Link)`
  color: var(--color-primary);
  white-space: pre;
`;

const LicenseNotice = styled.span`
  font-size: 1rem;
  display: inline-block;
  line-height: 1.5;

  @media screen and (max-width: 800px) {
    /* text-align: center; */
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;

  @media screen and (max-width: 800px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
`;

const Footer = () => {
  const { t } = useTranslation("footer");
  const router = useRouter();
  return (
    <StyledFooter>
      <LicenseNotice>
        <Trans t={t} i18nKey="licensenotice">
          The content on this page is licensed under a{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/legalcode">
            CC BY 4.0
          </a>{" "}
          license
        </Trans>
      </LicenseNotice>
      <Nav>
        <StyledLink
          href="https://github.com/riesinger/nononsensecooking"
          rel="noopener"
        >
          GitHub
        </StyledLink>
        <StyledLink href="/legal" passHref prefetch={false}>
          {t("link.legal.text")}
        </StyledLink>
        <StyledLink href="/donate" passHref prefetch={false}>
          {t("link.donate.text")}
        </StyledLink>
        <StyledLink
          href={`/rss/feed.${router.locale || router.defaultLocale}.xml`}
        >
          <Icon path={mdiRss} size={1} title={t("link.rss.title")} />
        </StyledLink>
      </Nav>
    </StyledFooter>
  );
};

export default Footer;
