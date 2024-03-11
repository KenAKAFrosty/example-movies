import {
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$
} from "@builder.io/qwik";
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
      img { 
        opacity: 0;
        filter: blur(4px);
        transition: opacity 0.5s ease-out, filter 0.5s ease-out;
        min-width: 21px;
      }
      .loaded { 
        opacity: 1;
        filter: blur(0);
      }
    `);
    const movieUrl = `/movie/${props.movieData.title
      .replaceAll(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .filter((x) => x)
      .join("-")}-${props.movieData.id}`;

    const thumbnailSrc = `${movieUrl}/thumbnail.png`;

    const imgRef = useSignal<HTMLImageElement>();
    const imageHasLoaded = useSignal(false);
    useVisibleTask$(()=> { 
      imgRef.value
        ?.decode()
        .then(() => {
          imageHasLoaded.value = true;
        })
        .catch(() => {
          console.log("Failed to decode image");
        });
    });
    
    return (
      <li key={props.movieData.title}>
        <Link href={movieUrl}>
          {props.movieData.title} ({props.movieData.year})
        </Link>
        <img
          class={{
            loaded: imageHasLoaded.value,
          }}
          ref={imgRef}
          src={thumbnailSrc}
          alt={props.movieData.title}
          height={30}
        />
      </li>
    );
  }
);
