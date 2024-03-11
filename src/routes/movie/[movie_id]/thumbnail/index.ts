import { type RequestHandler } from "@builder.io/qwik-city";
import { getMovieIdFromRequestEvent } from "../shared_functionality";

export const onGet: RequestHandler = async (event) => {
  const movieId = getMovieIdFromRequestEvent(event);
  if (!movieId) {
    throw event.error(400, "Invalid movie id");
  }
  console.log("movieId", movieId);
};
