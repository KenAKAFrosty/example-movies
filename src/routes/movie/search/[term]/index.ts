import { type RequestHandler } from "@builder.io/qwik-city";
import { searchMovieTitles } from "./helpers";
import { LONG_LIVED_CACHE_CONTROL } from "~/constants";

export const onGet: RequestHandler = async (event) => {
  const term = event.params.term;
  if (!term) {
    throw event.error(400, "Invalid search term");
  }
  const searchResults = await searchMovieTitles(term, event);
  event.headers.set("Cache-Control", LONG_LIVED_CACHE_CONTROL);
  event.json(200, searchResults);
};
