const express = require('express')
const path = require('path')
const xss = require('xss')
const uuid = require('uuid/v4')
const PostsService = require('./posts-service')
const { requireAuth } = require('../middleware/jwt-auth')

const contentRouter = express.Router()
const bodyParser = express.json({
  limit: '800kb'
})

contentRouter
  .route('/')
  .get((req, res, next) => {
    PostsService.getAllPosts(req.app.get('db'))
      .then(posts => {
        res.json(posts.map(post => ({
          id: post.id,
          type: post.type,
          title: xss(post.title),
          caption: xss(post.caption),
          text_title: xss(post.text_title),
          text_content: xss(post.text_content),
          image: post.image,
          video: post.video,
          audio: post.audio
        })))
      })
      .catch(next)
  })
  .post(bodyParser, requireAuth, (req, res, next) => {
    const { type, title, caption = '', text_title = '', text_content = '', image = '', video = '', audio = ''} = req.body
    if (!title || !type) {
      return res
        .status(400)
        .json({
          error: { message: `Missing "title" or "type" in request body`}
        })
    }
    const newPost = {
      type,
      title,
      caption,
      text_title,
      text_content,
      image,
      video,
      audio
    }
    PostsService.insertPost(
      req.app.get('db'),
      newPost
    )
    .then(post => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${post.id}`))
        .json({
          id: post.id,
          type: post.type,
          title: xss(post.title),
          caption: xss(post.caption),
          text_title: xss(post.text_title),
          text_content: xss(post.text_content),
          image: post.image,
          video: post.video,
          audio: post.audio
        })
    })
    .catch(next)
  })

contentRouter
  .route('/:post_id')
  .all((req, res, next) => {
    PostsService.getById(
      req.app.get('db'),
      req.params.post_id
    )
    .then(post => {
      if (!post) {
        return res
          .status(404)
          .json({
            error: { message: `Post doesn't exist`}
          })
      }
      res.post = post
      next()
    })
    .catch(next)
  })
  .get((req, res, next) => {
    PostsService.getById(
      req.app.get('db'),
      req.params.post_id
    )
    .then(post => {
      if (!post) {
        return res
          .status(404)
          .json({
            error: { message: `Post doesn't exist` }
          })
      }
      res.json({
        id: post.id,
        type: post.type,
        title: xss(post.title),
        caption: xss(post.caption),
        text_title: xss(post.text_title),
        text_content: xss(post.text_content),
        image: post.image,
        video: post.video,
        audio: post.audio
      })
    })
    .catch(next)
  })
  .delete((req, res, next) => {
    PostsService.deletePost(
      req.app.get('db'),
      req.params.post_id
    )
      .then(() => {
        res
          .status(204)
          .end()
      })
      .catch(next)
  })
  .patch(bodyParser, (req, res, next) => {
    const { type, title, caption = '', text_title = '', text_content = '', image = '', video = '', audio = ''} = req.body
    const postToUpdate = {
      type,
      title,
      caption,
      text_title,
      text_content,
      image,
      video,
      audio
    }
    PostsService.updatePost(
      req.app.get('db'),
      req.params.post_id,
      postToUpdate
    )
      .then(numRowsAffected => {
        res
          .status(204)
          .end()
      })
      .catch(next)
  })



module.exports = contentRouter
