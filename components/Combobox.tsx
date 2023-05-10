import { Combobox as HCombobox, Transition } from "@headlessui/react";
import { mdiCheck, mdiUnfoldMoreHorizontal } from "@mdi/js";
import Icon from "@mdi/react";
import { Fragment, Key, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Array<string>;
  filter: (query: string, option: string) => boolean;
  displayName: (value: string) => string;
}

export default function Combobox<T extends Key = string>({
  options,
  filter: filterFunction,
  value,
  onChange,
  displayName,
}: Props) {
  const [query, setQuery] = useState("");
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => filterFunction(query, option));

  return (
    <HCombobox value={value} onChange={onChange}>
      <div className="relative mt-1">
        <div className="relative w-full overflow-hidden text-left rounded-lg shadow cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <HCombobox.Input<T>
            className="w-full py-2 pl-4 pr-10 leading-5 text-gray-800 border-none text-md focus:ring-0 bg-zinc-200 dark:bg-zinc-800 dark:text-gray-200"
            displayValue={(value) => displayName(value as string)}
            onChange={(event) => setQuery(event.target.value)}
          />
          <HCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon
              aria-hidden="true"
              size={0.75}
              className="text-gray-400"
              path={mdiUnfoldMoreHorizontal}
            />
          </HCombobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <HCombobox.Options className="absolute z-20 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="relative px-4 py-2 text-gray-700 cursor-default select-none dark:text-gray-200">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <HCombobox.Option
                  key={option}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-indigo-100 dark:bg-indigo-600 text-indigo-900 dark:text-white"
                        : "text-gray-900 dark:text-gray-200"
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {displayName(option)}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-700 dark:text-indigo-100`}
                        >
                          <Icon
                            size={0.75}
                            path={mdiCheck}
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </HCombobox.Option>
              ))
            )}
          </HCombobox.Options>
        </Transition>
      </div>
    </HCombobox>
  );
}
