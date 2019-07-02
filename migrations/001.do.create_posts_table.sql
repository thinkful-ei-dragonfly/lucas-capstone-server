CREATE TABLE coleccion_posts (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"type" post_type NOT NULL,
	title text NOT NULL,
	caption text NULL,
	text_title text NULL,
	text_content text NULL,
	image text NULL,
	video text NULL,
	audio text NULL
);
