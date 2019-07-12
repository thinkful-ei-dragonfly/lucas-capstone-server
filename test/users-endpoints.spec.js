const knex = require('knex')
const app = require('../src/app')
const bcrypt = require('bcryptjs')
const helpers = require('./test-helpers')
const { TEST_DATABASE_URL } = require('../src/config')

describe('Users Endpoints', function() {
  let db

  const testUsers = helpers.makeUsersArray()

  before('make knex connection to db', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/users`, () => {
    context('User Validation', () => {
      beforeEach('insert users', () => {
        helpers.seedUsers(
          db,
          testUsers
        )
      })

      const requiredFields = ['user_name', 'password', 'full_name']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: 'test user_name',
          password: 'test password',
          full_name: 'test full_name'
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, { error: `Missing ${field} in request body`})
        })
        it(`responds 400 'Password must be longer than 8 characters' when an invalid password is entered`, () => {
          const userShortPassword = {
            user_name: 'test_user_name',
            password: 'short',
            full_name: 'test full_name'
          }
          return supertest(app)
            .post('/api/users')
            .send(userShortPassword)
            .expect(400, { error: `Password must be longer than 8 characters`})
        })
        it(`responds 400 'Password must be less than 72 characters' when a long password is entered`, () => {
          const userLongPassword = {
            user_name: 'test user_name',
            password: ':)'.repeat(73),
            full_name: 'test full_name'
          }
          return supertest(app)
            .post('/api/users')
            .send(userLongPassword)
            .expect(400, { error: `Password must be less than 72 characters` })
        })
        it(`responds 400 error when password starts with spaces`, () => {
          const userPasswordStartsSpacees = {
            user_name: 'test user_name',
            password: ' 1Aa!2Bb@',
            full_name: 'test full_name',
          }
          return supertest(app)
            .post('/api/users')
            .send(userPasswordStartsSpacees)
            .expect(400, { error: `Password must not start or end with empty spaces` })
        })
        it(`responds 400 error when password isn't complex enough`, () => {
          const userPasswordNotComplex = {
             user_name: 'test user_name',
             password: '11AAaabb',
             full_name: 'test full_name',
           }
           return supertest(app)
             .post('/api/users')
             .send(userPasswordNotComplex)
             .expect(400, { error: `Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character` })
        })
      })
    })
    context(`Happy path`, () => {
    it(`responds 201, serialized user, storing bcryped password`, () => {
      const newUser = {
        user_name: 'test user_name',
        password: '11AAaa!!',
        full_name: 'test full_name',
      }
      return supertest(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.user_name).to.eql(newUser.user_name)
          expect(res.body.full_name).to.eql(newUser.full_name)
          expect(res.body).to.not.have.property('password')
         })
         .expect(res =>
           db
            .from('users')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.user_name).to.eql(newUser.user_name)
              return bcrypt.compare(newUser.password, row.password)
            })
            .then(compareMatch => {
              expect(compareMatch).to.be.true
            })
         )
       })
   })
  })

})
