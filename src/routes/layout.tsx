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
  console.log(interFontDeclarationString);
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
    }
  `);
  return <Slot />;
});
