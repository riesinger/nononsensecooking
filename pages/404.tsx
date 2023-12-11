import { mdiArrowLeft, mdiGithub, mdiPotSteamOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import SEO from "../components/SEO";

export const getStaticProps: GetStaticProps = async ({
  locale,
  defaultLocale,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale!, [
        "common",
        "header",
        "footer",
      ])),
    },
  };
};

export default function NotFound({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("common");
  return (
    <>
      <SEO title={t("notfound.pagetitle")} />
      <div className="mx-auto prose dark:prose-invert prose-neutral px-8 box-content">
        <h1>{t("notfound.displaytitle")}</h1>
        <p>{t("notfound.explanation")}</p>
        <nav className="flex items-center flex-wrap gap-x-8 gap-y-4">
          <Link href="/" className="inline-flex items-center gap-x-2">
            <Icon path={mdiArrowLeft} size={1} />
            {t("notfound.links.home")}
          </Link>
          <Link href="/r" className="inline-flex items-center gap-x-2">
            <Icon path={mdiPotSteamOutline} size={1} />
            {t("notfound.links.allrecipes")}
          </Link>
          <Link
            href="https://github.com/riesinger/nononsensecooking/issues"
            className="inline-flex items-center gap-x-2"
          >
            <Icon path={mdiGithub} size={1} />
            {t("notfound.links.github")}
          </Link>
        </nav>
      </div>
    </>
  );
}
