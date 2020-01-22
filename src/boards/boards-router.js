const express = require('express')
const path = require('path')
const xss = require('xss')
const uuid = require('uuid/v4')
const BoardsService = require('./boards-service')
const { requireAuth } = require('../middleware/jwt-auth')

const contentRouter = express.Router()
const bodyParser = express.json({
  limit: '100000000k'
})

contentRouter
  .route('/')
  .get((req, res, next) => {
    BoardsService.getAllBoards(req.app.get('db'))
      .then(boards => {
        res.json(boards.map(board => ({
          id: board.id,
          owner: xss(board.owner),
          title: xss(board.title),
          description: xss(board.description)
        })))
      })
      .catch(next)
  })
  .post(bodyParser, requireAuth, (req, res, next) => {
    const { owner, title = '' , description = ''} = req.body
    if (!title) {
      return res
        .status(400)
        .json({
          error: { message: `Missing "title" in request body`}
        })
    }
    const newBoard = {
      owner,
      title,
      description
    }
    BoardsService.insertBoard(
      req.app.get('db'),
      newBoard
    )
    .then(board => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${board.id}`))
        .json({
          id: board.id,
          title: xss(board.title),
          description: xss(board.description),
        })
    })
    .catch(next)
  })

contentRouter
  .route('/:board_id')
  .all((req, res, next) => {
    BoardsService.getById(
      req.app.get('db'),
      req.params.board_id
    )
    .then(board => {
      if (!board) {
        return res
          .status(404)
          .json({
            error: { message: `Board doesn't exist`}
          })
      }
      res.board = board
      next()
    })
    .catch(next)
  })
  .get((req, res, next) => {
    BoardsService.getById(
      req.app.get('db'),
      req.params.board_id
    )
    .then(board => {
      if (!board) {
        return res
          .status(404)
          .json({
            error: { message: `Board doesn't exist` }
          })
      }
      res.json({
        id: board.id,
        title: xss(board.title),
        description: xss(board.description)
      })
    })
    .catch(next)
  })
  .delete((req, res, next) => {
    BoardsService.deleteBoard(
      req.app.get('db'),
      req.params.board_id
    )
      .then(() => {
        res
          .status(204)
          .end()
      })
      .catch(next)
  })
  .patch(bodyParser, (req, res, next) => {
    const { owner, title , description = ''} = req.body
    const boardToUpdate = {
      owner,
      title,
      description
    }
    BoardsService.updatePost(
      req.app.get('db'),
      req.params.board_id,
      boardToUpdate
    )
      .then(numRowsAffected => {
        res
          .status(204)
          .end()
      })
      .catch(next)
  })



module.exports = contentRouter
