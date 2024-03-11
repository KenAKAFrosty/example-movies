import {
  $,
  component$,
  useOnDocument,
  useStylesScoped$,
  useTask$
} from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { sql } from "kysely";
import { DO_NOT_CACHE_CONTROL } from "~/constants";
import { getQueryBuilder } from "~/database/query_builder";
import { getMovieUrlFromTitleAndId } from "./movie/shared_functionality";

export const useRandomMovies = routeLoader$((event) => {
  event.headers.set("Cache-Control", DO_NOT_CACHE_CONTROL);
  return getQueryBuilder()
    .selectFrom("movies")
    .selectAll()
    .where("thumbnail", "!=", "")
    .orderBy(sql`RANDOM()`)
    .limit(12)
    .execute();
});

export default component$(() => {
  useStylesScoped$(`
  main { 
    padding-top: 32px;
  }
  h1 { 
      text-align: center;
      margin-bottom: 12px;
  }
  ul { 
    width: 380px;
  }
  h3 { 
    font-weight: normal;
    font-size: 16px;
  }
  ul { 
    list-style: none;
    padding: 0;
  }
`);

  const randomMovies = useRandomMovies();
  return (
    <main>
      <h3>Here are a few random movies</h3>
      <ul>
        {randomMovies.value.map((row) => (
          <RandomMovie movieData={row} key={row.id} />
        ))}
      </ul>
    </main>
  );
});

const RandomMovie = component$(
  (props: {
    movieData: ReturnType<typeof useRandomMovies>["value"][number];
  }) => {
    useStylesScoped$(`
      li { 
        font-size: 20px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
      }
    `);

    const movieUrl = getMovieUrlFromTitleAndId(props.movieData);
    const thumbnailSrc = `${movieUrl}/thumbnail.png`;
    useTask$(() => {
      if (typeof window === "undefined") {
        return;
      }
      fetch(thumbnailSrc).catch((e) => {
        console.log("Error when prefetching thumbnail", e);
      });
    });
    useOnDocument(
      "DOMContentLoaded",
      $(() => {
        fetch(thumbnailSrc).catch((e) => {
          console.log("Error when prefetching thumbnail", e);
        });
      })
    );

    return (
      <li key={props.movieData.title}>
        <Link href={movieUrl}>
          {props.movieData.title} ({props.movieData.year})
        </Link>
      </li>
    );
  }
);
