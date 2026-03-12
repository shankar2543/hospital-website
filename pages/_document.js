import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Primary meta */}
        <meta name="description" content="Medicover Hospital — AI-powered healthcare management platform for patients, doctors, and administrators." />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Medicover Hospital" />
        <meta property="og:title" content="Medicover Hospital" />
        <meta property="og:description" content="AI-powered healthcare management platform for patients, doctors, and administrators." />
        <meta property="og:url" content="https://hospital-website-delta-eight.vercel.app" />
        <meta property="og:image" content="https://hospital-website-delta-eight.vercel.app/Logo-medicover.png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:alt" content="Medicover Hospital" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Medicover Hospital" />
        <meta name="twitter:description" content="AI-powered healthcare management platform for patients, doctors, and administrators." />
        <meta name="twitter:image" content="https://hospital-website-delta-eight.vercel.app/Logo-medicover.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
