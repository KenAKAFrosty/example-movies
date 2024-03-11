import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
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
  h3 { 
    font-weight: normal;
    font-size: 16px;
  }
  ul { 
    list-style: none;
    padding: 0;
  }
  ul li { 
    font-size: 20px;
    margin-bottom: 8px;
  }
`);

  const randomMovies = useRandomMovies();

  return (
    <main>
      <h3>Here are a few random movies</h3>
      <ul>
        {randomMovies.value.map((row) => (
          <li key={row.title}>
            <Link
              href={`/movie/${row.title
                .split(" ")
                .filter((x) => x)
                .join("-")}-${row.id}`}
            >
              {row.title} ({row.year})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
});
