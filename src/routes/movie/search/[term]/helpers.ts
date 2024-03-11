import { type RequestEventBase } from "@builder.io/qwik-city";
import { sql } from "kysely";
import { getQueryBuilder } from "~/database/query_builder";

export async function searchMovieTitles(term: string, event: RequestEventBase) {
  event; //We don't happen to need this, but requiring the arg is a very simple way to make sure this is never attempted to be called from the browser
  const preparedTerm = term.replaceAll(/\s+/g, " & ");
  const results = await getQueryBuilder()
    .selectFrom("movies")
    .select([
      "title",
      "thumbnail",
      "year",
      "thumbnail_height",
      "thumbnail_width",
      "id",
      sql<number>`ts_rank(title_tsvector, to_tsquery('english', ${preparedTerm}))`.as(
        "rank"
      ),
    ])
    .where(
      "title_tsvector",
      "@@",
      sql<string>`to_tsquery('english', ${preparedTerm})`
    )
    .orderBy("rank", "desc")
    .orderBy("title")
    .limit(10)
    .execute()
    .catch((e) => {
      console.log(e);
      return [];
    });

  return results.length === 0 ? null : results;
}

export type SearchResults = Awaited<ReturnType<typeof searchMovieTitles>>;
