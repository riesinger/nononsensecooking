import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PageLoadingIndicator from "../components/PageLoadingIndicator";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PageLoadingIndicator />
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5686f5" />
        <meta name="msapplication-TileColor" content="#5686f5" />
        <meta name="theme-color" content="#5686f5" />
        <script
          async
          defer
          data-domain="nononsense.cooking"
          src="https://plausible.riesinger.dev/count.js"
        ></script>
      </Head>
      <Header />
      <main className="mt-8 flex-grow-1 flex-shrink-0">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default appWithTranslation(MyApp);
