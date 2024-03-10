import {
  Kysely,
  PostgresDialect,
  type Insertable,
  type Selectable,
  type Simplify,
} from "kysely";
import pg from "pg";
import { type DB } from "./generated_types";
import dotenv from "dotenv";
dotenv.config();

type MakeSelectable<AnyDB> = {
  [Key in keyof AnyDB]: Simplify<Selectable<AnyDB[Key]>>;
};
export type SelectableDB = MakeSelectable<DB>;

type MakeInsertable<AnyDB> = {
  [Key in keyof AnyDB]: Simplify<Insertable<AnyDB[Key]>>;
};
export type InsertableDB = MakeInsertable<DB>;

let queryBuilder: Kysely<DB> | null = null;

export function getQueryBuilder() {
  if (!queryBuilder) {
    queryBuilder = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new pg.Pool({
          connectionString:
            process.env.DATABASE_PRIVATE_URL ?? process.env.DATABASE_URL,
          max: 10,
        }),
      }),
    });
  }
  return queryBuilder;
}
