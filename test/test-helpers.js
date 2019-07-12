const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
function makeUsersArray () {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'test full_name',
      password: 'Password!1'
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'test full_name',
      password: 'Password!2'
    }
  ]
}

function makePostsArray() {
  return [
    {
      id: uuid(),
      type: 'Text',
      title: 'Test Title 1',
      caption: '',
      text_title: 'Test Text Headline',
      text_content: 'Test Text Body',
      image: null,
      video: null,
      audio: null
    },
    {
      id: uuid(),
      type: 'Image',
      title: 'Image Test Title 1',
      caption: 'Cool Image',
      text_title: '',
      text_content: '',
      image: 'https://66.media.tumblr.com/4d5785a890e73cd547de929f884a070c/tumblr_njry2eNltj1sbr6who1_1280.jpg',
      video: null,
      audio: null
    }
  ]
}

function makeExpectedPosts(post) {
  return {
    id: post.id,
    type: post.type,
    title: post.title,
    caption: post.caption,
    text_title: post.text_title,
    text_content: post.text_content,
    image: post.image,
    video: post.video,
    audio: post.audio
  }

}

function makeMaliciousPost() {
  const maliciousPost = {
    id: uuid(),
    type: 'Image',
    title: 'Malicious Title',
    caption: '',
    text_title: '',
    text_content: '',
    image: '<img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);"> Bad code',
    video: null,
    audio: null
  }
  const expectedPost = {
    ...maliciousPost,
    image: 'http://c0.thejournal.ie/media/2013/10/soccer-extra-time-390x285.jpg'
  }
  return {
    maliciousPost,
    expectedPost
  }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      coleccion_posts,
      users,
      styles`
  )
}
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
    db.raw(
      `SELECT setval('users_id_seq', ?)`,
      [users[users.length - 1].id],
    )
  )
}
function seedPosts(db, posts) {
  return posts.map(post => {
    return db
      .insert(post)
      .into('coleccion_posts')
      .returning('*')
      .then(response => {
        return response[0]
      })
  })

}
function seedMaliciousPost(db, badPost) {
  return db
    .insert(badPost)
    .into('coleccion_posts')
    .returning('*')
    .then(response => {
      return response[0]
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

module.exports = {
  seedUsers,
  seedPosts,
  seedMaliciousPost,
  makeMaliciousPost,
  makePostsArray,
  makeUsersArray,
  makeExpectedPosts,
  makeAuthHeader,
  cleanTables
}
