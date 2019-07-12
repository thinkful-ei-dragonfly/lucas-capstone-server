CREATE TABLE users (
	id serial NOT NULL,
	user_name text NOT NULL,
	full_name text NOT NULL,
	"password" text NOT NULL,
	date_created timestamp NOT NULL DEFAULT now(),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_user_name_key UNIQUE (user_name)
);
