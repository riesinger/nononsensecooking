import Link from "next/link";
import styled from "styled-components";

const StyledHeader = styled.header`
  padding: 1rem 4rem;
  margin: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const StyledHeading = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
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
`;

const Header = () => (
  <StyledHeader>
    <Link href="/">
      <a>
        <StyledHeading>NoNonsenseCooking</StyledHeading>
      </a>
    </Link>
    <SearchBar placeholder="Search for recipes and ingredients" />
  </StyledHeader>
);

export default Header;
