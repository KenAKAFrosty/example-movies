import {
  component$,
  useStylesScoped$
} from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, Link } from "@builder.io/qwik-city";
import { sql } from "kysely";
import { getQueryBuilder } from "~/database/query_builder";

export const useRandomMovies = routeLoader$(() => {
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
  h2 { 
    font-weight: normal;
    font-size: 18px;
  }
`);


  const randomMovies = useRandomMovies();

  return (
    <main>

      <h2>Here are a few random movies</h2>
      <ul>
        {randomMovies.value.map((row) => (
          <li key={row.title}>
            <Link href={`/movie/${row.id}`}>{row.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Qwik | Example Movies",
  meta: [
    {
      name: "Qwik | Example Movies",
      content: "Inspired by Ryan from Remix's original example using Remix",
    },
  ],
};
