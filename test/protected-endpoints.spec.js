const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { TEST_DATABASE_URL } = require('../src/config')

describe('Protected endpoints', function() {
  let db

  const testUsers = helpers.makeUsersArray()
  const testPosts = helpers.makePostsArray()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert things', () =>
    helpers.seedPosts(
      db,
      testPosts
    )
  )

  const protectedEndpoints = [
    {
      name: 'POST /api/styles/',
      path: '/api/styles/',
      method: supertest(app).post
    },
    {
      name: 'POST /api/posts',
      path: '/api/posts',
      method: supertest(app).post
    },
    {
      name: 'POST /api/auth/refresh',
      path: '/api/auth/refresh',
      method: supertest(app).post
    }
  ]
  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, {error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = {user_name: 'user-not-exist', id: 1}
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: 'Unauthorized request'})
      })
    })
  })
})
