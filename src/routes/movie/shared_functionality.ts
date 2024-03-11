import { type RequestEventBase } from "@builder.io/qwik-city";

export function getMovieIdFromRequestEvent(event: RequestEventBase) {
  console.log(event.params);
  if (!event.params.movie_id) {
    return null;
  }
  const movieIdString = event.params.movie_id.split("-").at(-1);
  if (!movieIdString) {
    return null;
  }
  const movieId = Number(movieIdString);
  if (isNaN(movieId)) {
    return null;
  }
  return movieId;
}

export function getMovieUrlFromTitleAndId(inputs: {
  title: string;
  id: number;
}) {
  return `/movie/${inputs.title
    .replaceAll(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter((x) => x)
    .join("-")}-${inputs.id}`;
}
