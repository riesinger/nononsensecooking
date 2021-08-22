import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const SpinnerCircle = styled.div`
  border-radius: 50%;
  border-width: 4px;
  border-color: var(--color-background-alt);
  border-top-color: var(--color-primary);
  border-style: solid;
  width: 3rem;
  height: 3rem;
  animation: ${rotate} 1s linear infinite;
`;

export default function Spinner() {
  return <SpinnerCircle />;
}
