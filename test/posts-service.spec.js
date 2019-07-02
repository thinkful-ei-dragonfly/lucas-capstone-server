const PostsService = require('../src/posts/posts-service')
const knex = require('knex')
describe('Posts service object', function() {
  let db

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL
    })
  })
  describe(`getAllPosts()`, () => {

    it(`resolves all articles from 'coleccion_posts' table`, () => {
      // test that this works
    })
  })
})
