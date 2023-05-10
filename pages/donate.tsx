import { mdiGithub } from "@mdi/js";
import Icon from "@mdi/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "../components/Link";
import Paragraph from "../components/Paragraph";
import SEO from "../components/SEO";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "donation"])),
    },
  };
};

const DonationOptionsList = (props) => <ul className="mb-4" {...props} />;
const DonationOption = (props) => <li className="leading-8" {...props} />;

const Section = ({ title, children }) => (
  <section className="max-w-2xl mx-auto px-8">
    <h3 className="font-medium text-3xl dark:text-zinc-100 text-zinc-900 mb-3 mt-10">
      {title}
    </h3>
    {children}
  </section>
);

const SubHeading = ({ children }) => (
  <h4 className="font-medium text-xl mt-6 mb-3">{children}</h4>
);

const monthlyOptions = [
  {
    href: "https://github.com/sponsors/riesinger",
    name: "GitHub Sponsors",
    icon: mdiGithub,
  },
];

const onetimeOptions = [
  {
    href: "https://github.com/sponsors/riesinger",
    name: "GitHub Sponsors",
    icon: mdiGithub,
  },
  { href: "https://paypal.me/PRiesinger", name: "PayPal" },
];

export default function Legal({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("donation");
  return (
    <>
      <SEO title={t("pagetitle")} />
      <Section title={t("displayPageTitle")}>
        <Paragraph>{t("introduction")}</Paragraph>

        <SubHeading>{t("section.monthly.title")}</SubHeading>
        <DonationOptionsList>
          {monthlyOptions.map((option) => (
            <DonationOption key={option.name}>
              <Link
                {...option}
                leftIcon={
                  option.icon ? <Icon size={0.75} path={option.icon} /> : null
                }
              >
                {option.name}
              </Link>
            </DonationOption>
          ))}
        </DonationOptionsList>
        <SubHeading>{t("section.onetime.title")}</SubHeading>
        <DonationOptionsList>
          {onetimeOptions.map((option) => (
            <DonationOption key={option.name}>
              <Link
                {...option}
                leftIcon={
                  option.icon ? <Icon size={0.75} path={option.icon} /> : null
                }
              >
                {option.name}
              </Link>
            </DonationOption>
          ))}
        </DonationOptionsList>
      </Section>
    </>
  );
}
