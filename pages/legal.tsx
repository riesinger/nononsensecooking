import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";
import { generateRSSFeeds } from "../lib/generateRSSFeeds";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // This is an ugly way to generate the RSS feeds during static generation
  await generateRSSFeeds();
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

export default function Legal({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("legal");
  return (
    <>
      <SEO title={t("pagetitle")} />
      <div className="mx-auto prose dark:prose-invert prose-neutral px-8 box-content">
        <section>
          <h1>{t("section.legal.title")}</h1>
          <dl>
            <dt className="font-semibold">{t("section.legal.owner")}</dt>
            <dd>Pascal Riesinger</dd>
            <dt className="mt-2 font-semibold">{t("section.legal.mail")}</dt>
            <dd>pascal@nononsense.cooking</dd>
          </dl>
          <p>{t("section.legal.contactformoreinformation")}</p>
        </section>
        <section>
          <h1>{t("section.privacy.title")}</h1>
          <p>
            <Trans t={t} i18nKey="section.privacy.introduction" />
          </p>
          <h2>{t("section.privacy.vercel.title")}</h2>
          <p>
            <Trans t={t} i18nKey="section.privacy.vercel.content">
              Diese Website auf einer von Vercel Inc. (340 S Lemon Ave #4133
              Walnut, CA 91789) bereitgestellten Plattform gehostet. Wir haben
              die in Vercel&apos;s Plattform eingebaute Analytics-Funktion
              deaktiviert, sodass wir durch Vercel keinerlei Zugriff auf
              Informationen über dich bekommen. Dennoch ist Vercel dazu
              berechtigt, für die Bereitstellung der Plattform eingeschränkte
              Daten zu sammeln. Die vollständige Datenschutzerklärung von Vercel
              kannst du dir{" "}
              <a href="https://vercel.com/legal/privacy-policy">hier</a>{" "}
              durchlesen.
            </Trans>
          </p>
          <h2>{t("section.privacy.plausible.title")}</h2>
          <p>
            <Trans t={t} i18nKey="section.privacy.plausible.content">
              Wir nutzen auf dieser Seite eine selbstverwaltete Installation von
              Plausible Analytics. Dabei handelt es sich um ein Werkzeug zum
              Erfassen von Analysedaten von Websites. Anders als bei vielen
              sogenannten Analytics-Tools nutzen wir Plausible nicht dazu, um
              Dich über das Internet hinweg zu tracken. Wir sammeln
              ausschließlich auf dieser Website Nutzungsdaten und können Dich
              als Person mit diesen Daten auch nicht identifizieren. Die
              Nutzungsdaten werden auf einem Server in Deutschland gespeichert,
              womit sie den sehr hohen europäischen Ansprüchen an Datenschutz
              unterliegen. Sobald du diese Seite besuchst, sammeln wir folgende
              Daten: die Seiten-URL, den Referrer-Header, deinen Browser, dein
              Betriebssystem, deinen Gerätetyp (Desktop, Mobiltelefon, Tablet)
              und das Land, aus dem du die Website aufrufst. Wenn du mehr über
              die Daten, die wir mit Plausible Analytics sammeln erfahren willst
              und herausfinden möchtest, warum wir damit nicht auf dich als
              Person schließen können, kannst du dir{" "}
              <a href="https://plausible.io/data-policy">hier</a> die
              Daten-Policy von Plausible anschauen.
            </Trans>
          </p>
        </section>
      </div>
    </>
  );
}
