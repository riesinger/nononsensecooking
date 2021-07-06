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
`;

const StyledLink = styled.a`
  color: var(--color-primary);
  margin-left: 20px;
`;

const LicenseNotice = styled.span`
  font-size: 1rem;
  display: inline-block;
  /* max-width: 500px; */
  line-height: 1.5;
`;

const Footer = () => {
  const { t } = useTranslation("footer");
  return (
    <StyledFooter>
      <LicenseNotice>{t("licensenotice")}</LicenseNotice>
      <nav>
        <StyledLink href="https://github.com/riesinger/nononsensecooking" rel="noopener">Github</StyledLink>
        <Link href="/legal" passHref>
          <StyledLink>{t("link.legal.text")}</StyledLink>
        </Link>
        <Link href="/donate" passHref>
          <StyledLink>{t("link.donate.text")}</StyledLink>
        </Link>
      </nav>
    </StyledFooter>
  );
};

export default Footer;
