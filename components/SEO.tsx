import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  title?: string;
  isRecipe?: boolean;
  img?: string;
};

const HOST = "https://nononsense.cooking";

const SEO = ({ title, isRecipe, img }: Props) => {
  const { t } = useTranslation("common");

  const ogTitle = isRecipe
    ? title
    : `${title ? title + " - " : ""}NoNonsenseCooking`;
  const titleTag = `${title ? title + " - " : ""}NoNonsenseCooking`;
  const { basePath, locale, locales, asPath } = useRouter();
  const recipeURL = `${HOST}${basePath}${asPath}`;
  // TODO: Create an image for non-recipe pages
  const imagePath = isRecipe ? `${HOST}/img/recipes/${img}` : "";
  const description = isRecipe
    ? t("meta.description.recipe", { name: title })
    : t("meta.description.main");

  return (
    <Head>
      <title>{titleTag}</title>
      <meta property="og:title" content={ogTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={recipeURL} />
      <meta property="og:image" content={imagePath} />
      <meta property="og:image:width" content="1600" />
      <meta property="og:image:height" content="1040" />
      <meta property="og:locale" content={locale} />
      {locales?.map((loc) => (
        <meta property="og:locale:alternate" content={loc} key={loc} />
      ))}
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="NoNonsenseCooking" />
      <meta name="author" content="Pascal Riesinger" />
      <meta
        name="keywords"
        content="Cooking, recipes, Kochen, Rezepte, Einfach, Simpel"
      />
    </Head>
  );
};

export default SEO;
