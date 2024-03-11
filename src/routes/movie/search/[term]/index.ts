import { type RequestHandler } from "@builder.io/qwik-city";
import { searchMovieTitles } from "./helpers";

export const onGet: RequestHandler = async (event) => {
  const term = event.params.term;
  if (!term) {
    throw event.error(400, "Invalid search term");
  }
  const searchResults = await searchMovieTitles(term, event);
  event.headers.set("Cache-Control", "public, max-age=3600");
  event.json(200, searchResults);
};
