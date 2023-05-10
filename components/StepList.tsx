import { HTMLProps } from "react";
import { Step } from "../models/Recipe";

interface Props {
  steps: Step[];
}

interface StepProps extends HTMLProps<HTMLLIElement> {
  index: number;
}

function Step({ index, children }: StepProps) {
  return (
    <li className="flex items-center flex-col md:flex-row gap-x-6 gap-y-4">
      <StepCounter>{index + 1}</StepCounter>
      <StepDescription>{children}</StepDescription>
    </li>
  );
}

const StepDescription = (props) => (
  <span className="text-center md:text-left" {...props} />
);

const StepCounter = (props) => (
  <span
    className="flex-none inline-block w-12 h-12 leading-[3rem] text-center bg-zinc-200 dark:bg-zinc-800 font-medium rounded-full"
    {...props}
  />
);

const StepList = ({ steps }: Props) => (
  <ol className="leading-6 mt-8 p-0 flex flex-col list-none space-y-12">
    {steps?.map((step, i) => (
      <Step key={step.stepIndex} index={step.stepIndex}>
        {step.text}
      </Step>
    ))}
  </ol>
);

StepList.Step = Step;
StepList.StepCounter = StepCounter;

export default StepList;
