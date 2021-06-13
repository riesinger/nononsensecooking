import styled from "styled-components";
import Link from "next/link";

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

const Footer = () => (
  <StyledFooter>
    <span>© {new Date().getFullYear()} - Pascal Riesinger</span>
    <nav>
      <Link href="/legal">
        <StyledLink>Legal information</StyledLink>
      </Link>
      <Link href="/donate">
        <StyledLink>Donate</StyledLink>
      </Link>
    </nav>
  </StyledFooter>
);

export default Footer;
