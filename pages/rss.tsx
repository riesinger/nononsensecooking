import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
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
        "feed",
      ])),
    },
  };
};

export default function RSS({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("feed");
  const { locale } = useRouter();
  return (
    <>
      <SEO title={t("pagetitle")} />
      <div className="mx-auto prose dark:prose-invert prose-neutral px-8 box-content prose-code:before:content-none prose-code:after:content-none">
        <h1> {t("displayPageTitle")}</h1>
        <p> {t("introduction")} </p>
        <div className="space-y-2">
          <div>
            RSS:{" "}
            <Link href={`/rss/feed.${locale}.xml`}>
              <code>https://nononsense.cooking/rss/feed.{locale}.xml</code>
            </Link>
          </div>
          <div>
            Atom:{" "}
            <Link href={`/rss/atom.${locale}.xml`}>
              <code>https://nononsense.cooking/rss/atom.{locale}.xml</code>
            </Link>
          </div>
          <div>
            JSON:{" "}
            <Link href={`/rss/feed.${locale}.json`}>
              <code>https://nononsense.cooking/rss/feed.{locale}.feed</code>
            </Link>
          </div>
        </div>
        <p className="text-sm">{t("feedtypes")}</p>
        <h2>{t("feedreader.sectionTitle")}</h2>
        <p>{t("feedreader.introduction")}</p>
        <h3>{t("feedreader.android")}</h3>
        <ul>
          <li>
            <a
              href="https://play.google.com/store/apps/details?id=allen.town.focus.reader"
              rel="noopener"
            >
              FocusReader
            </a>
          </li>
          <li>
            <a
              href="https://play.google.com/store/apps/details?id=com.devhd.feedly"
              rel="noopener"
            >
              Feedly
            </a>
          </li>
          <li>
            <a
              href="https://play.google.com/store/apps/details?id=flipboard.app"
              rel="noopener"
            >
              Flipboard
            </a>
          </li>
        </ul>
        <h3>{t("feedreader.iOS")}</h3>
        <ul>
          <li>
            <a
              href="https://apps.apple.com/us/app/unread-an-rss-reader/id1363637349"
              rel="noopener"
            >
              Unread
            </a>
          </li>
          <li>
            <a
              href="https://apps.apple.com/us/app/feedly-smart-news-reader/id396069556"
              rel="noopener"
            >
              Feedly
            </a>
          </li>
          <li>
            <a
              href="https://apps.apple.com/app/flipboard-news-for-you/id358801284"
              rel="noopener"
            >
              Flipboard
            </a>
          </li>
        </ul>
        <h3>{t("feedreader.other")}</h3>
        <ul>
          <li>
            <a href="https://apps.nextcloud.com/apps/news" rel="noopener">
              Nextcloud News
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
