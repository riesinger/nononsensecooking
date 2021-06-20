import { ReactNode } from "react";
import styled from "styled-components";

const StyledSection = styled.section`
  width: 100%;
  max-width: 2000px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

const Title = styled.h3`
  font-weight: normal;
`;

type Props = {
  title: string;
  children?: ReactNode;
};

export const PaddedSection = ({ title, children }: Props) => (
  <StyledSection>
    <Title>{title}</Title>
    {children}
  </StyledSection>
);
