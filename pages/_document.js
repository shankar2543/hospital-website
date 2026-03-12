import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Primary meta */}
        <meta name="description" content="Medicover Hospital offers expert doctors, 24/7 support, and modern facilities. Book appointments, track your health, and manage your care — all in one platform." />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Medicover Hospital" />
        <meta property="og:title" content="Medicover Hospital | Advanced Healthcare Management Platform" />
        <meta property="og:description" content="Medicover Hospital offers expert doctors, 24/7 support, and modern facilities. Book appointments, track your health, and manage your care — all in one platform." />
        <meta property="og:url" content="https://hospital-website-delta-eight.vercel.app" />
        <meta property="og:image" content="https://hospital-website-delta-eight.vercel.app/logo.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Medicover Hospital — Your Health, Our Priority" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Medicover Hospital | Advanced Healthcare Management Platform" />
        <meta name="twitter:description" content="Medicover Hospital offers expert doctors, 24/7 support, and modern facilities. Book appointments, track your health, and manage your care — all in one platform." />
        <meta name="twitter:image" content="https://hospital-website-delta-eight.vercel.app/logo.jpg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
