const router = require('express').Router()
const { todoController } = require('../controllers')

router.route('/').post(todoController.createTodo).get(todoController.getTodos)

router
  .route('/:id')
  .get(todoController.getTodoById)
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo)

module.exports = router
