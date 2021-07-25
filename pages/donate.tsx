import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styled from "styled-components";
import SEO from "../components/SEO";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "header",
        "footer",
        "donation",
      ])),
    },
  };
};

const DonatePage = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const IntroParagraph = styled.p`
  max-width: 70ch;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
`;

const PageTitle = styled.h2`
  font-size: 2rem;
`;

const DonationSection = styled.section`
  margin-top: 2rem;
`;

const DonationOptionHeading = styled.h3`
  font-weight: 500;
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0;
`;

const DonationOptionsList = styled.ul`
  margin: 0 0 1rem 0;
`;

const DonationOption = styled.li`
  line-height: 2rem;
`;

const DonationLink = styled.a<{ preferred?: boolean }>`
  color: var(--color-primary);
  font-weight: ${({ preferred }) => (preferred ? "600" : "500")};
`;
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
      <DonatePage>
        <PageTitle>{t("displayPageTitle")}</PageTitle>
        <IntroParagraph>{t("introduction")}</IntroParagraph>

        <DonationSection>
          <DonationOptionHeading>
            {t("section.monthly.title")}
          </DonationOptionHeading>
          <DonationOptionsList>
            {monthlyOptions.map((option) => (
              <DonationOption key={option.name}>
                {option.href ? (
                  <DonationLink {...option}>{option.name}</DonationLink>
                ) : (
                  <span>{option.name}</span>
                )}
              </DonationOption>
            ))}
          </DonationOptionsList>
          <DonationOptionHeading>
            {t("section.onetime.title")}
          </DonationOptionHeading>
          <DonationOptionsList>
            {onetimeOptions.map((option) => (
              <DonationOption key={option.name}>
                {option.href ? (
                  <DonationLink {...option}>{option.name}</DonationLink>
                ) : (
                  <span>{option.name}</span>
                )}
              </DonationOption>
            ))}
          </DonationOptionsList>
        </DonationSection>
      </DonatePage>
    </>
  );
}
