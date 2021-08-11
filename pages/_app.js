import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import styled from "styled-components";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PageLoadingIndicator from "../components/PageLoadingIndicator";
import "../styles/globals.css";

const Main = styled.main`
  flex: 1 0 auto;
`;

const isProduction = process.env.NODE_ENV === "production";

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
        {isProduction ? (
          <script
            data-goatcounter="https://analytics.nononsense.cooking/count"
            async
            src="https://analytics.nononsense.cooking/count.js"
          ></script>
        ) : (
          false
        )}
      </Head>
      <Header />
      <Main>
        <Component {...pageProps} />
      </Main>
      <Footer />
    </>
  );
}

export default appWithTranslation(MyApp);
