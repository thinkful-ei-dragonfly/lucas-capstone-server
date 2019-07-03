const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

authRouter
  .post('/login', jsonParser, (req, res, next) => {
    const { user_name, password } = req.body
    const loginUser = { user_name, password }

    for (const [key, value] of Object.entries(loginUser)) {
      if (value == null) {
        return res.status(400).json({
            error: `Missing '${key}' in request body`
          })
      }
    }
    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.user_name
    )
      .then(databaseUser => {
        if (!databaseUser) {
          return res.status(400).json({
              error: 'Incorrect user_name or password'
            })
        }
        return AuthService.comparePasswords(loginUser.password, databaseUser.password)
          .then(compareMatch => {
            if (!compareMatch) {
              return res.status(400).json({
                  error: 'Incorrect user_name or password'
                })
            }
            const subject = databaseUser.user_name
            const payload = { user_id: databaseUser.id }
            res.send({
              authToken: AuthService.createJwt(subject, payload)
            })
          })
      })
      .catch(next)
  })
  .post('/refresh', requireAuth, (req, res) => {
    const subject = req.user.user_name
    const payload = { user_id: req.user.id}
    res.send({
      authToken: AuthService.createJwt(subject, payload)
    })
  })

module.exports = authRouter
