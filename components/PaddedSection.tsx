import { ReactNode } from "react";
import styled from "styled-components";

const StyledSection = styled.section<{ width?: "default" | "narrow" }>`
  width: 100%;
  max-width: ${({ width }) => (width === "narrow" ? "700px" : "2000px")};
  margin: 0 auto 4rem auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

const Title = styled.h3<{ smallHeadings?: boolean }>`
  font-weight: ${({ smallHeadings }) => (smallHeadings ? "500" : "700")};
  font-size: ${({ smallHeadings }) => (smallHeadings ? "1.75rem" : "2rem")};
  color: var(--color-text-primary);
`;

type Props = {
  title?: string;
  children?: ReactNode;
  width?: "default" | "narrow";
  smallHeadings?: boolean;
};

export const PaddedSection = ({
  title,
  children,
  width,
  smallHeadings,
}: Props) => (
  <StyledSection width={width}>
    {title ? <Title smallHeadings={smallHeadings}>{title}</Title> : null}
    {children}
  </StyledSection>
);
