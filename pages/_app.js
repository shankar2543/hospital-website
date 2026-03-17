import "@/styles/globals.css";
import Head from "next/head";
import dynamic from "next/dynamic";

const LiquidCursor = dynamic(() => import("@/components/LiquidCursor"), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      <LiquidCursor />
      <Component {...pageProps} />
    </>
  );
}
