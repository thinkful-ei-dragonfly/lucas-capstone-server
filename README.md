# Colección

Colección is an interactive, multimedia, collage-style blog leveraging React, Express, jQuery, Node, PostgreSQL, and SASS

Authors can create Image, Video, or Text post objects. These posts can be resized and rearranged as a collage
## Server Address

https:// blah blah

## Tech Stack



## Screenshots

`GET /api/posts` returns all posts in the database

![All Posts](./screenshots/get-home.png)

`POST /api/posts` inserts a new post object into the database. The API responds with the newly created post object.

The client makes a subsequent call to `POST /api/styles` passing in the newly created post's id. The API inserts a new object with the id passed in to the `post` column, which is a foreign key referencing the `coleccion_posts` table `id` column. This ensures each post object has a corresponding database entry for custom css styles

![Create Form](./screenshots/create.png)

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
