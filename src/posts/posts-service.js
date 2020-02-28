const PostsService = {
  getAllPosts(db, board) {
    return db
      .from('posts AS post')
      .where({ board })
  },
  insertPost(db, newPost) {
    return db
      .insert(newPost)
      .into('posts')
      .returning('*')
      .then(response => {
        return response[0]
      })
  },
  getById(db, id ) {
    return db
      .from('posts')
      .select('*')
      .where({ id })
      .first()
  },
  deletePost(db, id) {
    return db
      .from('posts')
      .where({ id })
      .delete()
  },
  updatePost(db, id, newPostFields) {
    return db
      .from('posts')
      .where({ id })
      .update(newPostFields)
  }
}
module.exports = PostsService
