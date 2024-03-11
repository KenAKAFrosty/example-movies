import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface CastMembers {
  id: Generated<number>;
  name: string;
}

export interface Genres {
  id: Generated<number>;
  name: string;
}

export interface MovieCast {
  cast_id: number;
  movie_id: number;
}

export interface MovieGenres {
  genre_id: number;
  movie_id: number;
}

export interface Movies {
  extract: string | null;
  href: string | null;
  id: Generated<number>;
  thumbnail: string | null;
  thumbnail_height: number | null;
  thumbnail_width: number | null;
  title: string;
  title_tsvector: Generated<string | null>;
  year: number | null;
}

export interface DB {
  cast_members: CastMembers;
  genres: Genres;
  movie_cast: MovieCast;
  movie_genres: MovieGenres;
  movies: Movies;
}
