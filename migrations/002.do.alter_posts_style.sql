CREATE TYPE post_type AS ENUM (
	'Text',
	'Video',
	'Image',
	'Audio');

ALTER TABLE coleccion_posts
  ADD COLUMN
    type post_type UNIQUE NOT NULL;
