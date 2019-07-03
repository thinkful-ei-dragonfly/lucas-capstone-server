const express = require('express')
const xss = require('xss')
const uuid = require('uuid/v4')
const StylesService = require('./styles-service')
const { requireAuth } = require('../middleware/jwt-auth')

const stylesRouter = express.Router()
const bodyParser = express.json()

stylesRouter
  .route('/')
  .get((req, res, next) => {
    StylesService.getAllStyles(req.app.get('db'))
      .then(styles => {
        res.json(styles.map(style => ({
          id: style.id,
          post: xss(style.post),
          top_style: xss(style.top_style),
          left_style: xss(style.left_style),
          width_style: xss(style.width_style),
          height_style: xss(style.height_style)
        })))
      })
      .catch(next)
  })
  .post(bodyParser, requireAuth, (req, res, next) => {
    const { post } = req.body
    if (!post) {
      return res
        .status(400)
        .json({
          error: { message: `Missing Post ID in request body` }
        })
    }
    const newStyle = {
      post,
      top_style: '',
      left_style: '',
      width_style: '',
      height_style: ''
    }
    StylesService.insertStyle(
      req.app.get('db'),
      newStyle
    )
      .then(style => {
        res
          .status(201)
          .json({
            id: style.id,
            post: xss(style.post),
            top_style: xss(style.top_style),
            left_style: xss(style.left_style),
            width_style: xss(style.width_style),
            height_style: xss(style.height_style)
          })
      })
      .catch(next)
  })

stylesRouter
  .route('/:style_id')
  .get((req, res, next) => {
    StylesService.getById(
      req.app.get('db'),
      req.params.style_id
    )
    .then(style => {
      if (!style) {
        return res
          .status(404)
          .json({
            error: { message: `Style doesn't exist` }
          })
      }
      res.json({
        id: style.id,
        post: xss(style.post),
        top_style: xss(style.top_style),
        left_style: xss(style.left_style),
        width_style: xss(style.width_style),
        height_style: xss(style.height_style)
      })
    })
    .catch(next)
  })
  .delete((req, res, next) => {
    StylesService.deleteStyle(
      req.app.get('db'),
      req.params.style_id
    )
      .then(() => {
        res
          .status(204)
          .end()
      })
      .catch(next)
  })
  .patch( bodyParser, (req, res, next) => {
    const { post, top_style, left_style, width_style, height_style } = req.body
    const styleToUpdate = {
      post,
      top_style,
      left_style,
      width_style,
      height_style
    }
    StylesService.updateStyle(
      req.app.get('db'),
      req.params.style_id,
      styleToUpdate
    )
    .then(numRowsAffected => {
      res
        .status(204)
        .end()
    })
    .catch(next)
  })


module.exports = stylesRouter
