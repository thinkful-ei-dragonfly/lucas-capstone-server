const express = require('express')
const xss = require('xss')
const data = require('./database')
const uuid = require('uuid/v4')

const contentRouter = express.Router()
const bodyParser = express.json()

contentRouter
  .route('/')
  .get((req, res, next) => {
    res
      .status(200)
      .json(data.map(post => {
        return {
          id: post.id,
          title: xss(post.title),
          post_type: post.post_type,
          caption: xss(post.caption),
          text_headline: xss(post.text_headline),
          text_content: xss(post.text_content),
          image_url: xss(post.image_url),
          video_url: xss(post.video_url),
          audio_url: xss(post.audio_url)
        }
      }))
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of [ 'post_type', 'title' ]) {
      if (!req.body[field]) {
        return res.status(400).send(`'${field}' is required`)
      }
    }
    const allowedPostTypes = ['text', 'image', 'video', 'audio']
    const { title, post_type, caption = '', text_headline ='', text_content = '', image_url = '', video_url = '', audio_url = '' } = req.body
    if (!allowedPostTypes.includes(post_type)) {
      return res.status(400).json({ error: { message: `Only 'text', 'image', 'video', and 'audio' post types are supported` }})
    }

    const newPost = {
      id: uuid(),
      title,
      post_type,
      caption,
      text_headline,
      text_content,
      image_url,
      video_url,
      audio_url
    }
    data.push(newPost)
    res.send(data)

  })

contentRouter
  .route('/:post_id')
  .get(bodyParser, (req, res, next) => {
    const { post_id } = req.params

    // write a service function to find it.
    // for now, we'll just search in memory
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === parseInt(post_id)) {
        res.json(data[i])
      }
      return res.status(404).json({
        error: { message: `Post not found`}
      })
    }
    console.log(typeof post_id)
    res.send(post_id)

  })
  .delete((req, res, next) => {
    const { post_id } = req.params
    let postToDelete = data.find(post => post.id === post_id)
    let postPostion = data.indexOf(postToDelete)
    data.splice(postPostion, 1)
    res.send(postToDelete)
  })


module.exports = contentRouter
