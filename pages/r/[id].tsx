import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PaddedSection } from "../../components/PaddedSection";
import Spinner from "../../components/Spinner";
import { queryParam } from "../../lib/queryParameter";
import { fetchFullRecipeIndex } from "../../lib/recipes";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = queryParam("id").from(context) || "";
  const fullIndex = await fetchFullRecipeIndex();
  const { availableIn, slugs, image } = await fullIndex[id];
  return {
    props: {
      id,
      availableIn,
      slugs,
      image,
      ...(await serverSideTranslations(
        context.locale ?? context.defaultLocale!,
        ["common", "footer", "header"],
      )),
    },
  };
}
export default function Redirect({
  availableIn,
  slugs,
  image,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, defaultLocale } = router;
  const [existsInLocale, setExistsInLocale] = useState<boolean | null>(null);
  useEffect(() => {
    if (availableIn.includes(locale)) {
      router.push(`/r/${slugs.find((v) => v.locale === locale).slug}`);
    } else {
      setExistsInLocale(false);
    }
  }, [router, availableIn, locale, slugs]);

  const prettyLocale = (loc: string) => t(`locales.${loc}`);

  return existsInLocale === null ? (
    <PaddedSection>
      <div className="flex justify-center">
        <Spinner />
      </div>
    </PaddedSection>
  ) : (
    <PaddedSection
      width="narrow"
      title={t("notinyourlocale.displaytitle", {
        locale: prettyLocale(locale ?? defaultLocale!),
      })}
    >
      <div className="w-full aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <Image src={`/img/recipes/${image}`} fill alt="An image of the dish" />
      </div>
      <p>
        {t("notinyourlocale.explanation", {
          locale: prettyLocale(locale ?? defaultLocale!),
        })}
      </p>
      <ul>
        {availableIn.map((loc) => (
          <li key={loc}>
            <Link
              href={`/r/${slugs.find((v) => v.locale === loc).slug}`}
              passHref
              locale={loc}
            >
              {prettyLocale(loc)}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Trans i18nKey="notinyourlocale.helptranslateit" t={t}>
          Falls du uns helfen willst, das Rezept auf{" "}
          {{ locale: prettyLocale(locale ?? defaultLocale!) }} zu übersetzen,
          schaue bei{" "}
          <a href="https://github.com/riesinger/nononsensecooking">Github</a>{" "}
          vorbei.
        </Trans>
      </p>
    </PaddedSection>
  );
}
