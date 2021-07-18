import { useTranslation } from "next-i18next";
import Link from "next/link";
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
    align-items: center;
    gap: 1rem;
  }
`;

const StyledLink = styled.a`
  color: var(--color-primary);
  white-space: pre;
`;

const LicenseNotice = styled.span`
  font-size: 1rem;
  display: inline-block;
  line-height: 1.5;

  @media screen and (max-width: 800px) {
    text-align: center;
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
  }
`;

const Footer = () => {
  const { t } = useTranslation("footer");
  return (
    <StyledFooter>
      <LicenseNotice>{t("licensenotice")}</LicenseNotice>
      <Nav>
        <StyledLink
          href="https://github.com/riesinger/nononsensecooking"
          rel="noopener"
        >
          Github
        </StyledLink>
        <Link href="/legal" passHref prefetch={false}>
          <StyledLink>{t("link.legal.text")}</StyledLink>
        </Link>
        <Link href="/donate" passHref prefetch={false}>
          <StyledLink>{t("link.donate.text")}</StyledLink>
        </Link>
      </Nav>
    </StyledFooter>
  );
};

export default Footer;
