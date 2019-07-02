const StylesService = {
  getAllStyles(db) {
    return db
      .from('styles')
      .select('*')
  },
  insertStyle(db, newStyle) {
    return db
      .insert(newStyle)
      .into('styles')
      .returning('*')
      .then(response => {
        return response[0]
      })
  },
  getById(db, id) {
    return db
      .from('styles')
      .select('*')
      .where('post', id)
      .first()
  },
  deleteStyle(db, id) {
    return db
      .from('styles')
      .where('post', id)
      .delete()
  },
  updateStyle(db, id, newStyleFields) {
    return db
      .from('styles')
      .where('post', id)
      .update(newStyleFields)
  }
}

module.exports = StylesService
