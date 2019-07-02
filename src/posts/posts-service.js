const PostsService = {
  getAllPosts(db) {
    return db
      .from('coleccion_posts AS post')
      .select('*')
  },
  insertPost(db, newPost) {
    return db
      .insert(newPost)
      .into('coleccion_posts')
      .returning('*')
      .then(response => {
        return response[0]
      })
  },
  getById(db, id) {
    return db
      .from('coleccion_posts')
      .select('*')
      .where({ id })
      .first()
  },
  deletePost(db, id) {
    return db
      .from('coleccion_posts')
      .where({ id })
      .delete()
  },
  updatePost(db, id, newPostFields) {
    return db
      .from('coleccion_posts')
      .where({ id })
      .update(newPostFields)
  }
}
module.exports = PostsService
