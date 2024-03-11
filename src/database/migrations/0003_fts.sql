ALTER TABLE movies ADD COLUMN title_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;
CREATE INDEX idx_title_tsvector ON movies USING GIN(title_tsvector);