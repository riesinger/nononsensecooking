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

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PageLoadingIndicator />
      <Head>
        <link rel="stylesheet" href="/inter.css" />
      </Head>
      <Header></Header>
      <Main>
        <Component {...pageProps} />
      </Main>
      <Footer></Footer>
    </>
  );
}

export default appWithTranslation(MyApp);
