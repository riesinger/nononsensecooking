import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/inter.css" />
      </Head>
      <Header></Header>
      <main>
        <Component {...pageProps} />
      </main>
      <Footer></Footer>
    </>
  );
}

export default MyApp;
