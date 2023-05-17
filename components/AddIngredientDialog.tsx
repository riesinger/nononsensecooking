import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "next-i18next";
import { Fragment, useState } from "react";
import { Unit } from "../models/Recipe";
import Button from "./Button";
import Combobox from "./Combobox";
import FormGroup from "./FormGroup";
import Input from "./Input";
import Select from "./Select";

interface Props {
  open?: boolean;
  onClose?: () => void;
  onAddIngredient: (
    ingredient: string,
    amount: number | null,
    unit: Unit,
    scales: boolean
  ) => void;
  ingredients: { [key: string]: string };
}

export default function AddIngredientDialog({
  open,
  onClose,
  onAddIngredient,
  ingredients,
}: Props) {
  const { t: recipeTranslations } = useTranslation("recipe");
  const { t: commonTranslations } = useTranslation("common");
  const unitTranslations: Record<Unit, string> = {
    none: recipeTranslations("unit-raw.none"),
    g: recipeTranslations("unit-raw.g"),
    kg: recipeTranslations("unit-raw.kg"),
    ml: recipeTranslations("unit-raw.ml"),
    l: recipeTranslations("unit-raw.l"),
    tbsp: recipeTranslations("unit-raw.tbsp"),
    pc: recipeTranslations("unit-raw.pc"),
  };

  const unitOptions = Object.keys(unitTranslations);
  const [selectedIngredient, setSelectedIngredient] = useState<string>(
    Object.keys(ingredients)[0]
  );
  const [amount, setAmount] = useState<number | null>(null);
  const [unit, setUnit] = useState<string>(unitOptions[0]);
  const [scales, setScales] = useState(false);

  function filterIngredients(query: string, ingredient: string) {
    return ingredients[ingredient]
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(query.toLowerCase().replace(/\s+/g, ""));
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" open={open} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl dark:bg-zinc-900">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  {commonTranslations("addingredientdialog.title")}
                </Dialog.Title>
                <div className="mt-2">
                  <FormGroup
                    id="ingredient"
                    label={recipeTranslations("ingredient-title")}
                  >
                    <Combobox
                      options={Object.keys(ingredients)}
                      value={selectedIngredient}
                      onChange={setSelectedIngredient}
                      filter={filterIngredients}
                      displayName={(ingredient) => ingredients[ingredient]}
                    />
                  </FormGroup>
                  <div className="flex flex-col md:flex-row items-start md:items-end w-full gap-x-2">
                    <FormGroup
                      id="amount"
                      label={recipeTranslations("amount-title")}
                      className="md:flex-grow w-full"
                    >
                      <Input
                        value={amount}
                        step="any"
                        onChange={(e) =>
                          setAmount(
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        type="number"
                      />
                    </FormGroup>
                    <FormGroup
                      id="unit"
                      label={recipeTranslations("unit-title")}
                    >
                      <Select
                        name="unit"
                        className="min-w-[10ch]"
                        value={unit}
                        onChange={setUnit}
                        options={unitOptions}
                        displayName={(unit) => unitTranslations[unit as Unit]}
                      />
                    </FormGroup>
                  </div>
                  <FormGroup
                    id="scales"
                    label={recipeTranslations("scales-with-servings")}
                    inlineLabel
                  >
                    <Input
                      type="checkbox"
                      checked={scales}
                      onChange={() => setScales(!scales)}
                    />
                  </FormGroup>
                </div>

                <div className="flex justify-end mt-4 gap-x-2">
                  <Button
                    variant="ghost"
                    colorScheme="negative"
                    onClick={onClose}
                  >
                    {commonTranslations("addingredientdialog.cancelbutton")}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      onAddIngredient(
                        selectedIngredient,
                        amount,
                        unit as Unit,
                        scales
                      )
                    }
                  >
                    {commonTranslations("addingredientdialog.addbutton")}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
