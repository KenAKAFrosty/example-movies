import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import "@fontsource-variable/inter";
import interFontDeclarationString from "@fontsource-variable/inter?inline";

function extractUrlsFromFontsourceString(fontsourceString: string) {
  const extractUrlsFromFontsourceStringRegex = /url\(([^)]+)\)/g;
  const matches = fontsourceString.match(extractUrlsFromFontsourceStringRegex);
  return matches ? matches.map((match) => match.slice(4, -1)) : [];
}

export const head: DocumentHead = (event) => {
  event; //leaving here to make clear we can access this if needed for anything dynamic we want in the <head>
  const interFontUrls = extractUrlsFromFontsourceString(
    interFontDeclarationString
  );
  return {
    links: interFontUrls.map((url) => {
      return {
        rel: "preload",
        href: url,
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
      };
    }),
  };
};

export default component$(() => {
  useStyles$(`
    * { 
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }
    html { 
      font-family: 'Inter Variable', sans-serif;
      background-color: #fefefe;
      color: #222;
    }
    body {
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      min-height: 100svh;
      font-weight: normal;
    }

    input,
    button,
    textarea,
    select {
        font: inherit;
    }
    
    span,
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        overflow-wrap: break-word;
    }
  `);
  return <Slot />;
});
