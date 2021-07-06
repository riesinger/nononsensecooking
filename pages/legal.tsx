import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styled from "styled-components";
import { PaddedSection } from "../components/PaddedSection";
import SEO from "../components/SEO";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "header",
        "footer",
        "legal",
      ])),
    },
  };
};

const Key = styled.span`
  display: inline-block;
  margin-right: 1ch;
  font-weight: 600;
`;

const LegalSection = styled.div`
  line-height: 2;
`;

export default function Legal({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("legal");
  return (
    <>
      <SEO title={t("pagetitle")} />
      <PaddedSection title={t("section.legal.title")}>
        <LegalSection>
          <div>
            <Key>{t("section.legal.owner")}</Key>
            <span>Pascal Riesinger</span>
          </div>
          <div>
            <Key>{t("section.legal.mail")}</Key>
            <span>pascal@nononsense.cooking</span>
          </div>
          <div>{t("section.legal.contactformoreinformation")}</div>
        </LegalSection>
      </PaddedSection>
      <PaddedSection title={t("section.privacy.title")}></PaddedSection>
    </>
  );
}
