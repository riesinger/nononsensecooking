import { useTranslation } from "next-i18next";
import Link from "next/link";
import styled from "styled-components";

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
