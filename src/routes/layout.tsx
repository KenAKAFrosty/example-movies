import {
  $,
  Slot,
  component$,
  sync$,
  useComputed$,
  useOnDocument,
  useOnWindow,
  useSignal,
  useStyles$,
  useStylesScoped$,
  useTask$,
  useVisibleTask$,
  type Signal,
} from "@builder.io/qwik";
import {
  Link,
  routeLoader$,
  server$,
  useLocation,
  type DocumentHead,
} from "@builder.io/qwik-city";
import "@fontsource-variable/inter";
import interFontDeclarationString from "@fontsource-variable/inter?inline";
import { GitHubLogo, QwikLogo } from "~/components/icons";
import { getQueryBuilder } from "~/database/query_builder";
import {
  searchMovieTitles,
  type SearchResults,
} from "./movie/search/[term]/helpers";
import { getMovieUrlFromTitleAndId } from "./movie/shared_functionality";

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

const SEARCH_TERM_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const SEARCH_TERM_COOKIE_NAME = "search_term";
export const useLoadedSearchFromServer = routeLoader$(async (event) => {
  const fromQueryParam = event.url.searchParams.get("search_for");
  const cookieString = event.request.headers.get("cookie") ?? "";
  const term = fromQueryParam ?? getSavedSearchTerm(cookieString);
  if (!term) {
    return {
      term: null,
      searchResults: null,
    };
  }
  event.cookie.set(SEARCH_TERM_COOKIE_NAME, term, {
    path: "/",
    maxAge: SEARCH_TERM_COOKIE_MAX_AGE,
  });
  const searchResults = await searchMovieTitles(term, event);
  return {
    term,
    searchResults,
  };
});

export default component$(() => {
  //Note the use of `useStyles$` vs `useStylesScoped$` to define global and scoped styles
  //Since this is the root layout, it's a great place to establish global styles, giving us some flexibility if needed.
  //But then for the actual layout, we want to use scoped styles to avoid conflicts with other parts of the app.
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
  useLoadedSearchFromServer();

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
  const location = useLocation();
  const showSearch = useSignal(false);
  useTask$(() => {
    if (location.url.searchParams.has("search_for")) {
      showSearch.value = true;
    }
  });
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

const CLEAR_BUTTON_WIDTH = 32;
const CLEAR_BUTTON_ACCOMODATION = CLEAR_BUTTON_WIDTH + 4;
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
      width: 380px;
      height: 80vh;
      height: 80dvh;
      padding: 12px;
      border-radius: 8px;
      box-shadow: 1px 1px 4px rgba(0,0,0,0.2), 2px 2px 15px rgba(0,0,0,0.1);
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    input { 
      border: none;
      width: 100%;
      outline: 1px solid #ccc;
      border-radius: 4px;
      padding: 4px ${CLEAR_BUTTON_ACCOMODATION}px 4px 8px;
    }
    ul { 
      list-style: none;
      overflow-y: auto;
    }
    .no-results { 
      padding-top: 12px;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
    }
    .input-with-button {
      display: flex;
      align-items: center;
    }
    .input-with-button button { 
      margin-left: -${CLEAR_BUTTON_ACCOMODATION}px;
      width: ${CLEAR_BUTTON_WIDTH}px;
      border: none;
    }
    .spacer { 
      flex-grow: 1;
    }
    .preview { 
      font-size: 12px;
      border: none;
      padding: 4px 10px;
      margin-right: 4px;
    }
    `);

    const inputRef = useSignal<HTMLInputElement>();
    const loadedSearchFromServer = useLoadedSearchFromServer();
    const preloadedSearchTerm = useComputed$(() => {
      if (loadedSearchFromServer.value.term) {
        return loadedSearchFromServer.value.term;
      }
      if (typeof window === "undefined") {
        return "";
      }
      return getSavedSearchTerm(document.cookie) ?? "";
    });
    const searchText = useSignal(preloadedSearchTerm.value);
    const searchResults = useSignal(loadedSearchFromServer.value.searchResults);
    const debounceTimer = useSignal<number>(0);
    const previewData = useSignal<null | PreviewData>(null);

    useTask$(({ track }) => {
      const term = track(() => searchText.value);
      if (typeof window === "undefined") {
        return;
      }
      document.cookie = `${SEARCH_TERM_COOKIE_NAME}=${term}; path=/; max-age=${SEARCH_TERM_COOKIE_MAX_AGE}`;
      previewData.value = null;
      clearTimeout(debounceTimer.value);
      if (!term) {
        searchResults.value = null;
        return;
      }
      debounceTimer.value = Number(
        setTimeout(() => {
          fetch("/movie/search/" + term).then(async (raw) => {
            const result = (await raw.json()) as SearchResults;
            searchResults.value = result;
          });
        }, 150)
      );
    });

    useVisibleTask$(() => {
      setTimeout(() => {
        inputRef.value!.focus();
      }, 20);
      window.document.body.style.overflow = "hidden";
      return () => {
        window.document.body.style.overflow = "auto";
      };
    });

    const location = useLocation();
    useTask$(({ track }) => {
      track(() => props.showModalSignal.value);
      track(() => searchText.value);
      if (typeof window === "undefined") {
        return;
      }
      if (props.showModalSignal.value) {
        const url = new URL(location.url.href);
        url.searchParams.set("search_for", searchText.value);
        window.history.replaceState(null, "", url.pathname + url.search);
      } else {
        window.history.replaceState(null, "", location.url.pathname);
      }
    });

    return (
      <main>
        <aside
          onClick$={() => {
            props.showModalSignal.value = false;
          }}
        />
        <section>
          <h2>Search Movies</h2>
          <div class="input-with-button">
            <input ref={inputRef} autoFocus={true} bind:value={searchText} />{" "}
            <button
              onClick$={() => {
                searchText.value = "";
              }}
            >
              X
            </button>
          </div>
          <ul>
            {searchResults.value === null ? (
              <div class="no-results">
                <h3>No results</h3>
              </div>
            ) : (
              searchResults.value.map((result) => (
                <SearchResult
                  result={result}
                  key={result.id}
                  previewData={previewData}
                  showModalSignal={props.showModalSignal}
                />
              ))
            )}
          </ul>
          <div class="spacer" />
          {previewData.value && <SearchPreview data={previewData.value} />}
        </section>
      </main>
    );
  }
);

const SearchResult = component$(
  (props: {
    result: NonNullable<SearchResults>[number];
    previewData: Signal<null | PreviewData>;
    showModalSignal: Signal<boolean>;
  }) => {
    const movieUrl = getMovieUrlFromTitleAndId(props.result);

    useTask$(() => {
      if (typeof window === "undefined") {
        return;
      }
      fetch(movieUrl + "/thumbnail.png").catch((e) => {
        console.log("Error when prefetching thumbnail", e);
      });
    });

    useOnDocument(
      "DOMContentLoaded",
      $(() => {
        fetch(movieUrl + "/thumbnail.png").catch((e) => {
          console.log("Error when prefetching thumbnail", e);
        });
      })
    );

    useStylesScoped$(`
      li { 
        display: flex;
        align-items: center;
        font-size: 18px;
        margin-top: 12px;
      }
    `);
    return (
      <li key={props.result.id}>
        <button
          class="preview"
          onClick$={() => {
            getPreviewDataFromServer(props.result.id).then((data) => {
              props.previewData.value = data ?? null;
            });
          }}
        >
          Preview
        </button>
        <Link
          onClick$={() => {
            setTimeout(() => {
              props.showModalSignal.value = false;
            }, 50);
          }}
          href={movieUrl}
        >
          {props.result.title} ({props.result.year})
        </Link>
      </li>
    );
  }
);

//Adding this server$ lookup is a little bit arbitrary because we could reasonably include the data in the search results,
//but using server$ is very common and helpful, and the rest of this demo happened to use pure data endpoints (e.g., /movie/search/[term])
//So I wanted to make sure I didn't paint a picture of that being the common/normal way of doing things.
const getPreviewDataFromServer = server$(async function (movie_id: number) {
  return getQueryBuilder()
    .selectFrom("movies")
    .select(["extract", "year", "title"])
    .where("id", "=", movie_id)
    .executeTakeFirst();
});

type PreviewData = NonNullable<
  Awaited<ReturnType<typeof getPreviewDataFromServer>>
>;

const SearchPreview = component$((props: { data: PreviewData }) => {
  const maxExtractLength = 200;
  return (
    <section>
      <h3>
        {props.data.title}
        <span>({props.data.year})</span>
      </h3>
      {props.data.extract && (
        <p>
          {props.data.extract.slice(0, maxExtractLength)}
          {props.data.extract.length > maxExtractLength && "....."}
        </p>
      )}
    </section>
  );
});

function getSavedSearchTerm(cookieString: string) {
  const cookies = cookieString.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === SEARCH_TERM_COOKIE_NAME) {
      return value;
    }
  }
  return undefined;
}

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
      height: 36px;
      width: 130px;
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
