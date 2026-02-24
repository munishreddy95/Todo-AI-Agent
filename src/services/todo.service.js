const { todoModel } = require('../models')

exports.createTodo = async (task) => {
  try {
    const newTodo = await todoModel.create({ task })
    return newTodo
  } catch (error) {
    console.error('Error creating todo:', error)
    throw error
  }
}

exports.getTodos = async (where) => {
  try {
    const todos = await todoModel.findAll({ where, raw: true })
    return todos
  } catch (error) {
    console.error('Error fetching todos:', error)
    throw error
  }
}

exports.getTodosCount = async (where) => {
  try {
    const count = await todoModel.count({ where })
    return count
  } catch (error) {
    console.error('Error counting todos:', error)
    throw error
  }
}

exports.getTodoById = async (id) => {
  try {
    const todo = await todoModel.findByPk(id)
    return todo
  } catch (error) {
    console.error('Error fetching todo by ID:', error)
    throw error
  }
}

exports.updateTodo = async (id, body) => {
  try {
    const todo = await todoModel.findByPk(id)
    if (!todo) {
      throw new Error('Todo not found')
    }

    todo.task = body?.task !== undefined ? body.task : todo.task
    todo.completed =
      body?.completed !== undefined ? body.completed : todo.completed
    await todo.save()

    return todo
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

exports.deleteTodo = async (id) => {
  try {
    const todo = await todoModel.findByPk(id)

    if (!todo) {
      throw new Error('Todo not found')
    }

    await todo.destroy()
    return { message: 'Todo deleted successfully' }
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
