import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const themeColor = '#111827';
  return (
    <Html lang="pt-BR">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={themeColor} />

        {/* iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />

        <link rel="icon" href="/icons/icon-192.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* registra o SW no cliente */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(()=>{});
              });
            }
          `
        }} />
      </body>
    </Html>
  );
}
