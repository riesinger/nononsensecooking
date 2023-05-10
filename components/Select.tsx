import { Listbox, Transition } from "@headlessui/react";
import { mdiCheck, mdiUnfoldMoreHorizontal } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { Fragment } from "react";

interface Props {
  value: string;
  onChange: (string) => void;
  options: Array<string>;
  displayName: (string) => string;
  name?: string;
  className?: string;
}

export default function Select({
  className,
  options,
  value,
  onChange,
  displayName,
  name,
}: Props) {
  const classes = clsx("relative", className);
  return (
    <Listbox value={value} onChange={onChange} name={name}>
      <div className={classes}>
        <Listbox.Button className="relative w-full py-2 pl-4 pr-10 leading-5 text-left rounded-lg shadow cursor-default light:bg-zinc-200 dark:bg-zinc-800 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
          <span className="block truncate">{displayName(value)}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <Icon
              aria-hidden="true"
              size={0.75}
              className="text-gray-400"
              path={mdiUnfoldMoreHorizontal}
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? "bg-indigo-100 dark:bg-indigo-600 text-indigo-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-200"
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {displayName(option)}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-700 dark:text-indigo-100">
                        <Icon size={0.75} path={mdiCheck} aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
