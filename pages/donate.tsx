import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
        "donation",
      ])),
    },
  };
};

const monthlyOptions = [
  {
    href: "https://github.com/sponsors/riesinger",
    name: "GitHub Sponsors",
    preferred: true,
  },
  { name: "Brave Rewards" },
];

const onetimeOptions = [
  {
    href: "https://github.com/sponsors/riesinger",
    name: "GitHub Sponsors",
    preferred: true,
  },
  { href: "https://paypal.me/PRiesinger", name: "PayPal", preferred: false },
  { name: "Brave Rewards" },
];

export default function Legal({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("donation");
  return (
    <>
      <SEO title={t("pagetitle")} />
      <div className="mx-auto prose dark:prose-invert prose-neutral px-8 box-content">
        <h1>{t("displayPageTitle")} </h1>
        <p>{t("introduction")}</p>

        <section>
          <h2>{t("section.monthly.title")}</h2>
          <ul>
            {monthlyOptions.map((option) => (
              <li key={option.name}>
                {option.href ? (
                  <a {...option}>{option.name}</a>
                ) : (
                  <span>{option.name}</span>
                )}
              </li>
            ))}
          </ul>
          <h2>{t("section.onetime.title")}</h2>
          <ul>
            {onetimeOptions.map((option) => (
              <li key={option.name}>
                {option.href ? (
                  <a {...option}>{option.name}</a>
                ) : (
                  <span>{option.name}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
