import { ReactNode } from "react";
import styled from "styled-components";

const StyledTrack = styled.div<{ sm: number; md?: number; lg?: number }>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${({ sm }) => sm}, 1fr);
  gap: 2rem;

  @media screen and (min-width: 700px) {
    grid-template-columns: repeat(${({ sm, md }) => (md ? md : sm)}, 1fr);
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(
      ${({ sm, md, lg }) => (lg ? lg : md ? md : sm)},
      1fr
    );
  }
`;

type Props = {
  lg?: number;
  md?: number;
  sm: number;
  children: ReactNode;
};

const Track = ({ sm, md, lg, children }: Props) => (
  <StyledTrack sm={sm} md={md} lg={lg}>
    {children}
  </StyledTrack>
);

export default Track;
