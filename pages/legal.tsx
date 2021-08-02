import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Trans, useTranslation } from "next-i18next";
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

const Paragraph = styled.p`
  line-height: 1.6;
  color: var(--color-text-secondary);
`;

const SubHeading = styled.h4`
  font-weight: 600;
  font-size: 1.4rem;
`;

export default function Legal({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("legal");
  return (
    <>
      <SEO title={t("pagetitle")} />
      <PaddedSection title={t("section.legal.title")} width="narrow">
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
      <PaddedSection title={t("section.privacy.title")} width="narrow">
        <Paragraph>
          <Trans t={t} i18nKey="section.privacy.introduction" />
        </Paragraph>
        <SubHeading>{t("section.privacy.vercel.title")}</SubHeading>
        <Paragraph>
          <Trans t={t} i18nKey="section.privacy.vercel.content">
            Diese Website auf einer von Vercel Inc. (340 S Lemon Ave #4133
            Walnut, CA 91789) bereitgestellten Plattform gehostet. Wir haben die
            in Vercel&apos;s Plattform eingebaute Analytics-Funktion
            deaktiviert, sodass wir durch Vercel keinerlei Zugriff auf
            Informationen über dich bekommen. Dennoch ist Vercel dazu
            berechtigt, für die Bereitstellung der Plattform eingeschränkte
            Daten zu sammeln. Die vollständige Datenschutzerklärung von Vercel
            kannst du dir{" "}
            <a href="https://vercel.com/legal/privacy-policy">hier</a>{" "}
            durchlesen.
          </Trans>
        </Paragraph>
        <SubHeading>{t("section.privacy.goatcounter.title")}</SubHeading>
        <Paragraph>
          <Trans t={t} i18nKey="section.privacy.goatcounter.content">
            Wir nutzen eine vom Inhaber dieser Seite bereitgestellte
            Installation von Goatcounter. Dabei handelt es sich um ein Werkzeug
            zum Erfassen von Analysedaten von Websites. Anders als bei vielen
            sogenannten Analytics-Tools nutzen wir Goatcounter nicht dazu, um
            Dich über das Internet hinweg zu tracken. Wir sammeln ausschließlich
            auf dieser Website Nutzungsdaten und können Dich als Person mit
            diesen Daten auch nicht identifizieren. Die Nutzungsdaten werden auf
            einem Server in Deutschland gespeichert, womit sie den sehr hohen
            europäischen Ansprüchen an Datenschutz unterliegen. Sobald du diese
            Seite besuchst, sammeln wir folgende Daten von deinem Gerät: Die URL
            der aufgerufenen Seite, den Referrer Header, den User-Agent Header,
            deine Bildschirmgröße, Deine Region, welche aus deiner IP-Adresse
            geschätzt wird und ein Hash Deiner IP-Adresse, des User-Agent
            Headers und einer zufälligen Zahl. Dabei wird weder die IP-Adresse,
            noch der berechnete Hash jemals auf ein persistentes Medium
            (Festplatte) geschrieben, sondern maximal 8 Stunden im
            Arbeitsspeicher vorgehalten. Es werden keinerlei Informationen in
            Deinem Browser abgelegt (Cookies, localStorage, ...). Die
            Datenschutzerklärung von GoatCounter kannst du dir auch{" "}
            <a href="https://www.goatcounter.com/privacy">hier</a> durchlesen.
            Zusätzlich stellt der Entwickler von GoatCounter auch ein Dokument
            bereit, welches die gesammelten Daten näher beschreibt. Dieses
            Dokument kannst Du dir{" "}
            <a href="https://www.goatcounter.com/gdpr">hier</a> ansehen.
            Solltest Du dem Sammeln der beschriebenen Daten widersprechen, aber
            die Seite trotzdem nutzen wollen, kannst Du einfach JavaScript in
            Deinem Browser deaktivieren. Damit wird das Laden von GoatCounter
            unterbunden.
          </Trans>
        </Paragraph>
      </PaddedSection>
    </>
  );
}
