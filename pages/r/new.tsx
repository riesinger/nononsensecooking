import { mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { readFile } from "fs/promises";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import slug from "slug";
import AddIngredientDialog from "../../components/AddIngredientDialog";
import Button from "../../components/Button";
import FormGroup from "../../components/FormGroup";
import IconButton from "../../components/IconButton";
import IngredientsList from "../../components/IngredientsList";
import Input from "../../components/Input";
import { PaddedSection } from "../../components/PaddedSection";
import Select from "../../components/Select";
import Spinner from "../../components/Spinner";
import StepList from "../../components/StepList";
import { Unit } from "../../models/Recipe";

export const getStaticProps: GetStaticProps = async (context) => {
  const ingredientsResponse = await readFile(
    `./public/locales/${context.locale}/recipe.json`
  );
  const ingredientsFile = JSON.parse(ingredientsResponse.toString()) as {
    ingredient: { [key: string]: string };
  };
  // Filter out plural forms, which contain an underscore
  const ingredientsWithTranslations = Object.fromEntries(
    Object.entries(ingredientsFile.ingredient)
      .filter(([key, _]) => !key.includes("_"))
      .sort()
  );

  return {
    props: {
      ingredientsWithTranslations,
      ...(await serverSideTranslations(context.locale, ["common", "recipe"])),
    },
  };
};

const recipeTypes = ["main", "starter", "dessert"];
const diets = ["vegetarian", "vegan", "fish", "meat"];
const locales = ["en", "de"];

// TODO: The "redirecting to sign in" message needs some stylingjs
export default function NewRecipePage({
  ingredientsWithTranslations,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [hasSession, setHasSession] = useState<boolean | undefined>(undefined);

  const router = useRouter();

  const [locale, setLocale] = useState(
    locales.find((locale) => locale === router.locale)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [diet, setDiet] = useState(diets[0]);
  const [type, setType] = useState(recipeTypes[0]);
  const [ingredientsInUse, setIngredientsInUse] = useState([]);
  const [addIngredientDialogOpen, setAddIngredientDialogOpen] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const { t } = useTranslation("common");

  function onAddStep(e) {
    e.preventDefault();
    const newSteps = [...steps, "This is a step"];
    setSteps(newSteps);
    console.log(newSteps);
  }

  function onStepDelete(index: number) {
    return function (e) {
      e.preventDefault();
      const newSteps = steps.slice();
      newSteps.splice(index, 1);
      setSteps(newSteps);
    };
  }

  function onStepTextChange(index: number) {
    return function (event: ChangeEvent<HTMLInputElement>) {
      const newSteps = steps.slice();
      newSteps[index] = event.target.value;
      setSteps(newSteps);
    };
  }

  async function onSubmitRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    // The recipe needs to be uploaded as multipart/form-data because of the image.
    const formData = new FormData(event.target as HTMLFormElement);
    console.log("submitting recipe");

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_HOST);
    formData.append("writtenBy", pb.authStore.model.id);
    formData.append("status", "draft");
    formData.append("diet", diet);
    formData.append("type", type);
    formData.append("locale", locale);
    formData.append("slug", slug(name).slice(0, 63));

    try {
      const response = await pb.collection("recipes").create(formData);
      const recipeId = response.id;

      // Persist every ingredient usage
      for (const ingredient of ingredientsInUse) {
        console.log(ingredient);
        const ingredientFD = new FormData();
        ingredientFD.append("recipe", recipeId);
        ingredientFD.append("amount", ingredient.amount);
        ingredientFD.append("unit", ingredient.unit);
        ingredientFD.append("ingredientId", ingredient.id);
        ingredientFD.append("scalesWithPortions", ingredient.scales);
        try {
          await pb.collection("ingredientUsages").create(ingredientFD);
        } catch {
          toast.error(t("new.create-result-error"));
          setIsSaving(false);
        }
      }

      // Persist every step
      for (const step of steps) {
        const stepFD = new FormData();
        stepFD.append("recipe", recipeId);
        stepFD.append("stepIndex", steps.indexOf(step).toString());
        stepFD.append("text", step);
        try {
          await pb.collection("steps").create(stepFD);
        } catch {
          toast.error(t("new.create-result-error"));
          setIsSaving(false);
        }
      }
      setIsSaving(false);
      toast.success(t("new.create-result-success"));
    } catch {
      toast.error(t("new.create-result-error"));
      setIsSaving(false);
    }
  }

  function onAddIngredientClicked(e) {
    e.preventDefault();
    setAddIngredientDialogOpen(true);
  }

  function onAddIngredient(
    ingredient: string,
    amount: number | undefined,
    unit: Unit,
    scales: boolean
  ) {
    setIngredientsInUse([
      ...ingredientsInUse,
      { id: ingredient, amount, unit, scales },
    ]);
    setAddIngredientDialogOpen(false);
  }

  function onIngredientDelete(id: string) {
    const newIngredients = ingredientsInUse.filter((i) => i.id !== id);
    setIngredientsInUse(newIngredients);
  }

  useEffect(
    function () {
      const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_HOST);
      if (!pb.authStore.isValid) {
        setHasSession(false);
        router.push(`/auth?returnTo=${encodeURIComponent(router.pathname)}`);
      } else {
        setHasSession(true);
      }
    },
    [router.query.slug]
  );

  return (
    <PaddedSection>
      {hasSession === undefined ? (
        <Spinner />
      ) : hasSession === true ? (
        <>
          <section>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              {t("new.pagetitle")}
            </h2>
            <p className="mt-1 mb-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {t("new.subtitle")}
            </p>
          </section>
          <form
            onSubmit={onSubmitRecipe}
            className="grid grid-cols-1 lg:grid-cols-[max-content_1fr] gap-x-12"
          >
            <section className="flex flex-col gap-y-2">
              <FormGroup id="locale" label={t("new.localeinput.label")}>
                <Select
                  name="locale"
                  onChange={setLocale}
                  value={locale}
                  options={locales}
                  displayName={(locale) => t(`locales.${locale}`)}
                />
              </FormGroup>
              <Input
                type="text"
                name="name"
                placeholder={t("new.nameinput.placeholder")}
                onChange={(e) => setName(e.target.value)}
                value={name}
                label={t("new.nameinput.label")}
                required
                id="name"
              />
              <FormGroup id="image" label={t("new.pictureinput.label")}>
                <Input id="image" type="file" name="image" />
              </FormGroup>
              <FormGroup id="type" label={t("recipetype.label")}>
                <Select
                  name="type"
                  onChange={setType}
                  value={type}
                  options={recipeTypes}
                  displayName={(type) => t(`recipetype.${type}`)}
                />
              </FormGroup>
              <FormGroup id="diet" label={t("diet.label")}>
                <Select
                  name="diet"
                  onChange={setDiet}
                  value={diet}
                  options={diets}
                  displayName={(diet) => t(`diet.${diet}`)}
                />
              </FormGroup>

              <Input
                type="number"
                required
                name="preparationTime"
                defaultValue={10}
                rightDecoration="min"
                label={t("preparationTime.label")}
                id="preparationTime"
              />
            </section>
            <section className="flex flex-col mt-2 gap-y-4">
              <div className="space-y-2">
                <h2 className="text-sm font-medium">
                  {t("new.ingredientssection.title")}
                </h2>
                <IngredientsList
                  ingredients={ingredientsInUse.map((ingredient) => ({
                    id: ingredient.id,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                    scalesWithPortions: ingredient.scales,
                  }))}
                  servingsMultiplier={1}
                  onDelete={onIngredientDelete}
                />
                <Button
                  onClick={onAddIngredientClicked}
                  leftIcon={<Icon size={0.75} path={mdiPlus} aria-hidden />}
                >
                  {t("new.ingredientssection.addbutton")}
                </Button>
                <AddIngredientDialog
                  open={addIngredientDialogOpen}
                  onClose={() => setAddIngredientDialogOpen(false)}
                  onAddIngredient={onAddIngredient}
                  ingredients={ingredientsWithTranslations}
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-sm font-medium">
                  {t("new.stepssection.title")}
                </h2>
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-x-2">
                    <StepList.StepCounter>{i + 1}</StepList.StepCounter>
                    <Input
                      type="text"
                      placeholder="describe your step"
                      value={step}
                      onChange={onStepTextChange(i)}
                    />
                    <IconButton
                      onClick={onStepDelete(i)}
                      icon={<Icon size={0.75} path={mdiTrashCanOutline} />}
                      ariaLabel="Delete Step"
                      variant="ghost"
                      colorScheme="negative"
                    />
                  </div>
                ))}
                <Button
                  onClick={onAddStep}
                  leftIcon={<Icon size={0.75} path={mdiPlus} aria-hidden />}
                >
                  {t("new.stepssection.addbutton")}
                </Button>
              </div>
            </section>
            <section className="lg:col-span-2 mt-4">
              <Button type="submit" variant="primary" loading={isSaving}>
                {t("new.submitbutton")}
              </Button>
            </section>
          </form>
        </>
      ) : (
        <span>{t("new.redirect-to-signin")}</span>
      )}
    </PaddedSection>
  );
}
