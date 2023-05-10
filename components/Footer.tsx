import { mdiCash, mdiGithub, mdiRss } from "@mdi/js";
import Icon from "@mdi/react";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Link from "./Link";

const Footer = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  return (
    <footer className="mt-8 py-4 px-8 w-full flex flex-col lg:flex-row justify-center items-start lg:items-center lg:justify-between gap-4 lg:gap-2">
      <span className="leading-6">
        <Trans t={t} i18nKey="licensenotice">
          The content on this page is licensed under a{" "}
          <Link href="https://creativecommons.org/licenses/by/4.0/legalcode">
            CC BY 4.0
          </Link>{" "}
          license
        </Trans>
      </span>
      <nav className="flex flex-col gap-2 items-start lg:flex-row lg:justify-center lg:items-center lg:gap-6">
        <Link href="/legal" prefetch={false}>
          {t("footer.link.legal.text")}
        </Link>
        <Link
          href="https://github.com/riesinger/nononsensecooking"
          rel="noopener"
          leftIcon={<Icon size={0.75} path={mdiGithub} />}
        >
          GitHub
        </Link>
        <Link href="/donate" passHref prefetch={false}>
          <Icon size={0.75} path={mdiCash} />
          {t("footer.link.donate.text")}
        </Link>
        <Link href={`/rss/feed.${router.locale || router.defaultLocale}.xml`}>
          <Icon path={mdiRss} size={0.75} title={t("footer.link.rss.title")} />
          RSS Feed
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
