require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const postsRouter = require('./posts/posts-router')
const stylesRouter = require('./styles/styles-router')
const usersRouter = require('./users/users-router')

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/posts', postsRouter)
app.use('/api/styles', stylesRouter)
app.use('/api/users', usersRouter)

app.use(function errorHandler(error, req, res, next) {
  let response;

  if (NODE_ENV === 'production') {
    response = { error: { message: 'server errror'}}
  } else {
    console.error(error);
    response = { message: error.message, error}
  }
  res.status(500).json(response);
})

module.exports = app;
