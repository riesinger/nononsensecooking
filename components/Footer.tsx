import styled from "styled-components";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const StyledFooter = styled.footer`
  padding: 1rem 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const StyledLink = styled.a`
  color: var(--color-primary);
  margin-left: 20px;
`;

const Footer = () => {
  const { t } = useTranslation("footer");
  return (
    <StyledFooter>
      <span>© {new Date().getFullYear()} - Pascal Riesinger</span>
      <nav>
        <Link href="/legal">
          <StyledLink>{t("link.legal.text")}</StyledLink>
        </Link>
        <Link href="/donate">
          <StyledLink>{t("link.donate.text")}</StyledLink>
        </Link>
      </nav>
    </StyledFooter>
  );
};

export default Footer;
