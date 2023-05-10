import { mdiArrowLeft, mdiGithub, mdiPotSteamOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "../components/Link";
import SEO from "../components/SEO";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
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
      <main className="max-w-2xl mx-auto px-8 py-8 lg:py-16">
        <h2 className="text-3xl mb-4">{t("notfound.displaytitle")}</h2>
        <p className="max-w-prose leading-normal text-zinc-700 dark:text-zinc-300 mb-8">
          {t("notfound.explanation")}
        </p>
        <div className="space-y-6 flex flex-col">
          <Link ghost href="/">
            <Icon path={mdiArrowLeft} size={1} />
            {t("notfound.links.home")}
          </Link>
          <Link ghost href="/r">
            <Icon path={mdiPotSteamOutline} size={1} />
            {t("notfound.links.allrecipes")}
          </Link>
          <Link
            ghost
            href="https://github.com/riesinger/nononsensecooking/issues"
          >
            <Icon path={mdiGithub} size={1} />
            {t("notfound.links.github")}
          </Link>
        </div>
      </main>
    </>
  );
}
