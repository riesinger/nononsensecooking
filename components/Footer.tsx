import { mdiRss } from "@mdi/js";
import Icon from "@mdi/react";
import { Trans, useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

const Footer = () => {
  const { t } = useTranslation("footer");
  const router = useRouter();
  return (
    <footer className="mt-8 py-4 px-8 w-full flex items-start lg:items-center justify-start gap-4 lg:justify-between lg:gap-2 flex-col lg:flex-row">
      <span>
        <Trans t={t} i18nKey="licensenotice">
          The content on this page is licensed under a{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/legalcode">
            CC BY 4.0
          </a>{" "}
          license
        </Trans>
      </span>
      <nav className="flex items-start lg:items-center justify-center gap-4 lg:gap-6 flex-col lg:flex-row">
        <Link
          className="text-brand whitespace-pre"
          href="https://github.com/riesinger/nononsensecooking"
          rel="noopener"
        >
          GitHub
        </Link>
        <Link
          className="text-brand whitespace-pre"
          href="/legal"
          prefetch={false}
        >
          {t("link.legal.text")}
        </Link>
        <Link
          className="text-brand whitespace-pre"
          href="/donate"
          prefetch={false}
        >
          {t("link.donate.text")}
        </Link>
        <Link
          className="text-brand whitespace-pre"
          href={`/rss/feed.${router.locale || router.defaultLocale}.xml`}
        >
          <Icon path={mdiRss} size={1} title={t("link.rss.title")} />
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
