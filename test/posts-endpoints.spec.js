const app = require('../src/app')
const knex = require('knex')
const helpers = require('./test-helpers')
const bcrypt = require('bcryptjs')
const { TEST_DATABASE_URL } = require('../src/config')

describe('Posts service object', function() {
  let db

  const testUsers = helpers.makeUsersArray()
  const testPosts = helpers.makePostsArray()

  before('make knex instance',() => {
    db = knex({
      client: 'pg',
      connection: TEST_DATABASE_URL
    })
    app.set('db', db)
  })
  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/posts`, () => {
    context(`Given no posts`, () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/posts')
          .expect(200, [])
      })
    })

    context('Given there are posts in the database', () => {
      beforeEach('insert posts', () => {
        helpers.seedPosts(
          db,
          testPosts
        )
      })

      it('responds with 200 and all the posts', () => {
        const expectedPosts = testPosts.map(post => post)
        return supertest(app)
          .get('/api/posts')
          .expect(res => {
            expect(res.body[0]).to.be.an('object')
            expect(res.body[0]).to.eql(expectedPosts[0])
            expect(res.body[0].title).to.eql(expectedPosts[0].title)
            expect(res.body[0].type).to.eql(expectedPosts[0].type)
            expect(res.body[0].id).to.eql(expectedPosts[0].id)
            expect(res.body[0]).to.have.property('type')
            expect(res.body[0].type).to.eql('Text')
          })
      })
    })

    context('Given an XSS attack', () => {
      const {
        maliciousPost,
        expectedPost
      } = helpers.makeMaliciousPost()

      beforeEach('insert malicious post', () => {
        return helpers.seedMaliciousPost(
          db,
          maliciousPost
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/posts')
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedPost.title)
            expect(res.body[0].type).to.eql(expectedPost.type)
            expect(res.body[0].image).to.not.eql(expectedPost.image)
          })
      })
    })
  })
})
