require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const boardsRouter = require('./boards/boards-router')
const postsRouter = require('./posts/posts-router')
const stylesRouter = require('./styles/styles-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors());
app.use(helmet());

app.use('/api/boards', boardsRouter)
app.use('/api/boards/:board_id/posts', postsRouter)
app.use('/api/boards/:board_id/styles', stylesRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app
  .route('/')
  .get((req, res, next) => {
    res
      .status(200)
      .send('Hello, world!')
  })
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    // response = { error: { message: 'server errror'}}
    console.error(error)
    response = { message: error.message, error}
  } else {
    console.error(error);
    response = { message: error.message, error}
  }
  res.status(500).json(response);
})

module.exports = app;
