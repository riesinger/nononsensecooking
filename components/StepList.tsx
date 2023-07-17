import { Recipe } from "../models/Recipe";

interface Props {
  steps: Recipe["steps"];
}

const StepList = ({ steps }: Props) => (
  <ol className="leading-normal m-0 p-0 flex flex-col list-none space-y-10">
    {steps?.map((step, i) => (
      <li
        className="flex flex-col md:flex-row items-center gap-y-6 md:gap-x-8"
        key={i}
      >
        <div className="bg-neutral-200 dark:bg-neutral-800 rounded-full w-8 h-8 leading-8 text-center flex-shrink-0">
          {i + 1}
        </div>
        <span className="text-left">{step}</span>
      </li>
    ))}
  </ol>
);

export default StepList;
