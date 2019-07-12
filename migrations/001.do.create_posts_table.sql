CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE coleccion_posts (
	id uuid NOT NULL DEFAULT UNIQUE uuid_generate_v4(),
	title text NOT NULL,
	caption text NULL,
	text_title text NULL,
	text_content text NULL,
	image text NULL,
	video text NULL,
	audio text NULL
);
