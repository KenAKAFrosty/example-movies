import { type RequestHandler } from "@builder.io/qwik-city";
import { getMovieIdFromRequestEvent } from "../shared_functionality";
import { getQueryBuilder } from "~/database/query_builder";

export const onGet: RequestHandler = async (event) => {
  const movieId = getMovieIdFromRequestEvent(event);
  if (!movieId) {
    throw event.error(400, "Invalid movie id");
  }

  const trueThumbnailLookup = await getQueryBuilder()
    .selectFrom("movies")
    .select("thumbnail")
    .where("id", "=", movieId)
    .where("thumbnail", "!=", "")
    .executeTakeFirst();
  const thumbnailLocation = trueThumbnailLookup?.thumbnail;
  if (!thumbnailLocation) {
    throw event.error(404, "Movie thumbnail not found");
  }

  const trueThumbnail = await fetch(thumbnailLocation);
  const buffer = await trueThumbnail.arrayBuffer();
  const response = new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
  event.send(response);
};
