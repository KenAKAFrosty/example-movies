import { type RequestHandler } from "@builder.io/qwik-city";
import { getMovieIdFromRequestEvent } from "../shared_functionality";
import { getQueryBuilder } from "~/database/query_builder";


//This isn't really necessary when linking to something as powerful as wikimedia (might be a little slower on first loads in fact),
//but it's a demonstration for when that source image might *not* be as reliable. 
//Taking this over allows us to make sure both the browser AND our CDN caches it, by providing the headers.
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
