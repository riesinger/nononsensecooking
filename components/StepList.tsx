import styled from "styled-components";
import { Recipe } from "../models/Recipe";

interface Props {
  steps: Recipe["steps"];
}

const List = styled.ol`
  line-height: 1.5;
  margin: 2rem 0 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  list-style-type: none;
`;

const Step = styled.li`
  display: flex;
  margin-bottom: 2rem;
  align-items: center;
  flex-direction: column;

  @media screen and (min-width: 800px) {
    flex-direction: row;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const StepCounter = styled.span`
  flex: 0 0 auto;
  display: inline-block;
  width: 3rem;
  height: 3rem;
  line-height: 3rem;
  background: var(--color-background-alt);
  text-align: center;
  font-size: 1.25rem;
  font-weight: 400;
  border-radius: var(--rounded-full);
  margin-bottom: 1.5rem;

  @media screen and (min-width: 800px) {
    margin-right: 2rem;
    margin-bottom: 0;
  }
`;

const StepDescription = styled.span`
  text-align: center;

  @media screen and (min-width: 800px) {
    text-align: left;
  }
`;

const StepList = ({ steps }: Props) => (
  <List>
    {steps?.map((step, i) => (
      <Step key={i}>
        <StepCounter className="list-counter">{i + 1}</StepCounter>
        <StepDescription>{step}</StepDescription>
      </Step>
    ))}
  </List>
);

export default StepList;
