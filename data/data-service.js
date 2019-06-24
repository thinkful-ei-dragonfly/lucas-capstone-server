const dataService = {
  getAllPosts(knex) {
    return knex
      .select('*')
      .from('posts')
  }
}
