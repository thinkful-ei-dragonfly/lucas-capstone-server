const BoardsService = {
  getAllBoards(db) {
    return db
      .from('boards AS board')
      .select('*')
  },
  insertBoard(db, newBoard) {
    return db
      .insert(newBoard)
      .into('boards')
      .returning('*')
      .then(response => {
        return response[0]
      })
  },
  getById(db, id) {
    return db
      .from('boards')
      .select('*')
      .where({ id })
      .first()
  },
  deleteBoard(db, id) {
    return db
      .from('boards')
      .where({ id })
      .delete()
  },
  updateBoard(db, id, newBoardFields) {
    return db
      .from('boards')
      .where({ id })
      .update(newBoardFields)
  }
}
module.exports = BoardsService
