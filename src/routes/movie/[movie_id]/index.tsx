import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getQueryBuilder } from "~/database/query_builder";
import { getMovieIdFromRequestEvent } from "./shared_functionality";

export const useThisMovie = routeLoader$(async (event) => {
  const movieId = getMovieIdFromRequestEvent(event);
  if (movieId === null) {
    // Could have graceful UI for this kind of thing, but for sake of demo, I'm just doing this
    throw event.error(400, "Invalid movie id");
  }

  const movieData = await getQueryBuilder()
    .selectFrom("movies")
    .selectAll()
    .where("id", "=", movieId)
    .executeTakeFirst();

  if (!movieData) {
    throw event.error(404, "Movie not found");
  }

  return movieData;
});

export const head: DocumentHead = (event) => {
  const movieData = event.resolveValue(useThisMovie);
  return {
    title: `(${movieData.year}) ${movieData.title} | Qwik | Example Movies`,
    meta: [
      {
        name: "description",
        content: movieData.extract ?? undefined,
      },
      {
        name: "og:title",
        content: movieData.title,
      },
      {
        name: "og:description",
        content: movieData.extract ?? undefined,
      },
      {
        name: "og:image",
        content: movieData.thumbnail ?? undefined,
      },
    ],
  };
};

export default component$(() => {
  const movieData = useThisMovie();
  return <main>{movieData.value.extract}</main>;
});
