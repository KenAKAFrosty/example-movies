import { type RequestHandler } from "@builder.io/qwik-city";
import { sql } from "kysely";
import { getQueryBuilder } from "~/database/query_builder";

export const onGet: RequestHandler = async (event) => {
  const term = event.params.term;
  if (!term) {
    throw event.error(400, "Invalid search term");
  }
  const preparedTerm = term.replaceAll(/\s+/g, " & ");
  const lookup = await getQueryBuilder()
    .selectFrom("movies")
    .select([
      "title",
      "id",
      sql<number>`ts_rank(title_tsvector, to_tsquery('english', ${preparedTerm}))`.as(
        "rank"
      ),
    ])
    .where("title_tsvector", "@@", sql<string>`to_tsquery('english', ${preparedTerm})`)
    .orderBy("rank", "desc")
    .orderBy("title")
    .limit(10)
    .execute();
  console.log(lookup);
  event.headers.set("Cache-Control", "public, max-age=3600");
  event.json(200, lookup.length === 0 ? null : lookup);
};
