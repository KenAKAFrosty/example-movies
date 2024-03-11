import { component$, useStylesScoped$ } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { getQueryBuilder } from "~/database/query_builder";
import { getMovieIdFromRequestEvent } from "../shared_functionality";

export const onGet: RequestHandler = async (event) => {
  event.headers.set("Cache-Control", "public, max-age=3600");
};

export const useThisMovie = routeLoader$(async (event) => {
  const movieId = getMovieIdFromRequestEvent(event);
  if (movieId === null) {
    // Could have graceful UI for this kind of thing, but for sake of demo, I'm just doing this
    throw event.error(400, "Invalid movie id");
  }

  const qb = getQueryBuilder();
  const movieData = await qb
    .selectFrom("movies")
    .leftJoin("movie_cast", "movie_cast.movie_id", "movies.id")
    .selectAll()
    .where("id", "=", movieId)
    .executeTakeFirst();

  console.log(movieData);
  if (!movieData) {
    throw event.error(404, "Movie not found");
  }

  const castLookup =
    movieData.cast_id === null
      ? null
      : await qb
          .selectFrom("cast_members")
          .selectAll()
          .where("id", "=", movieData.cast_id)
          .execute();
  return { movie: movieData, cast: castLookup };
});

export const head: DocumentHead = (event) => {
  const movieData = event.resolveValue(useThisMovie);
  return {
    title: `(${movieData.movie.year}) ${movieData.movie.title} | Qwik | Example Movies`,
    meta: [
      {
        name: "description",
        content: movieData.movie.extract ?? undefined,
      },
      {
        name: "og:title",
        content: movieData.movie.title,
      },
      {
        name: "og:description",
        content: movieData.movie.extract ?? undefined,
      },
      {
        name: "og:image",
        content: movieData.movie.thumbnail ?? undefined,
      },
    ],
  };
};

export default component$(() => {
  const movieData = useThisMovie();

  useStylesScoped$(`
    h1 { 
      margin: 18px auto;
      display: flex;
      text-align: center;
      width: 100%;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      max-width: 380px;
    }
    .year { 
      font-size: 18px;
      font-weight: normal;
      margin-left: 8px;
      margin-top: 2px;
    }
    section { 
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    .info { 
      margin-top: 4px;
      max-width: 380px;
      padding: 8px;
    }
    h3 { 
      margin-top: 28px;
    }
    ul { 
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    ul li { 
      padding: 4px 8px;
      border-radius: 8px;
      outline: 1px solid #ccc;
    }
    `);

  return (
    <main>
      <h1>
        {movieData.value.movie.title}
        <span class="year">({movieData.value.movie.year})</span>
      </h1>
      <section>
        {movieData.value.movie.thumbnail && (
          <img
            src={movieData.value.movie.thumbnail ?? ""}
            alt={movieData.value.movie.title}
            height={movieData.value.movie.thumbnail_height ?? undefined}
            width={movieData.value.movie.thumbnail_width ?? undefined}
          />
        )}
        <div class="info">
          <p>{movieData.value.movie.extract}</p>
          {movieData.value.cast && (
            <>
              <h3>Known Cast Members</h3>
              <ul>
                {movieData.value.cast.map((castMember) => {
                  return <li key={castMember.name}>{castMember.name}</li>;
                })}
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  );
});
