import {
  $,
  component$,
  type Signal,
  Slot,
  sync$,
  useOnWindow,
  useSignal,
  useStyles$,
  useStylesScoped$,
  useTask$,
} from "@builder.io/qwik";
import { Link, type DocumentHead, useLocation } from "@builder.io/qwik-city";
import "@fontsource-variable/inter";
import interFontDeclarationString from "@fontsource-variable/inter?inline";
import { GitHubLogo, QwikLogo } from "~/components/icons";

function extractUrlsFromFontsourceString(fontsourceString: string) {
  const extractUrlsFromFontsourceStringRegex = /url\(([^)]+)\)/g;
  const matches = fontsourceString.match(extractUrlsFromFontsourceStringRegex);
  return matches ? matches.map((match) => match.slice(4, -1)) : [];
}

export const head: DocumentHead = (event) => {
  const interFontUrls = extractUrlsFromFontsourceString(
    interFontDeclarationString
  );
  return {
    title: event.head.title || "Qwik | Example Movies",
    meta: [
      {
        name: "description",
        content: "Inspired by Ryan from Remix's original example using Remix",
      },
    ],
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

    button { 
      cursor: pointer;
    }
  `);

  useStylesScoped$(`
    main { 
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      min-height 100dvh;
    }
    div { 
      flex-grow: 1;
    }
  `);
  return (
    <main>
      <Header />
      <div>
        <Slot />
      </div>
      <Footer />
    </main>
  );
});

const Header = component$(() => {
  useStylesScoped$(`
    header { 
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    header div { 
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 12px;
    }
    h1 { 
      text-align: center;
    }
    a svg { 
      height: 1em;
      width: 1em;
      margin-bottom: -2px;
    }

    button { 
      margin-top: 12px;
      border-radius: 8px;
      padding: 4px 12px;
      border: none;
    }

    h2 { 
      font-size: 18px;
      font-weight: normal;
    }
  `);

  const showSearch = useSignal(false);
  useOnWindow(
    "keydown",
    sync$((e: KeyboardEvent) => {
      if (e.key === "k" && e.ctrlKey) {
        e.preventDefault();
      }
    })
  );
  useOnWindow(
    "keydown",
    $((e) => {
      if (e.key === "k" && e.ctrlKey) {
        showSearch.value = true;
      }
    })
  );
  const location = useLocation();
  console.log(location.url.pathname);
  return (
    <header>
      {showSearch.value && <SearchModal showModalSignal={showSearch} />}
      <div>
        <a href="https://github.com/KenAKAFrosty/example-movies">
          <button>
            <GitHubLogo /> Code
          </button>
        </a>
      </div>
      <h1>
        {location.url.pathname === "/" ? (
          "Movies!"
        ) : (
          <Link href={"/"}>Movies!</Link>
        )}
      </h1>
      <button
        onClick$={() => {
          showSearch.value = true;
        }}
      >
        <h2>Tap here, or press CTRL + K for search</h2>
      </button>
    </header>
  );
});

const SearchModal = component$(
  (props: { showModalSignal: Signal<boolean> }) => {
    useStylesScoped$(`
    main { 
      position: fixed;
      top:0;
      left: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0,0,0,0.1);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1;
    }
    aside { 
      position: fixed;
      width: 100%;
      min-height: 100vh;
      z-index: 1;
    }
    section { 
      background-color: white;
      width: 200px;
      height: 200px;
      z-index: 2;
    }
  `);

    useTask$(() => {
      if (typeof window === "undefined") return;
      window.document.body.style.overflow = "hidden";
      return () => {
        window.document.body.style.overflow = "auto";
      };
    });
    return (
      <main>
        <aside
          onClick$={() => {
            props.showModalSignal.value = false;
          }}
        />
        <section></section>
      </main>
    );
  }
);

const Footer = component$(() => {
  useStylesScoped$(`
    footer { 
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
      font-size: 12px;
    }
    div { 
      display: flex;
      align-items: center;
    }
    .qwik a { 
      color: inherit;
    }
    .qwik a svg { 
      height: 2em;
      margin-bottom: -5px;
      margin-right: -12px;
    }
    .qwik { 
      font-size: 18px;
    }
    .others a { 
      min-width: 180px;
      text-align: center;
    }
  `);
  return (
    <footer>
      <div class="qwik">
        <p>Powered by </p>
        <a href="https://qwik.dev">
          <QwikLogo />
        </a>
      </div>
      <div class="others">
        <a href="https://remix-movies.pages.dev/">
          Ryan's Original Remix Example
        </a>
        <a href="https://sveltekit-movies-demo.vercel.app/">
          Rich's SvelteKit Example
        </a>
      </div>
    </footer>
  );
});
