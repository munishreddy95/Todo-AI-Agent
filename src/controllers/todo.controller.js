const { get } = require('http')
const { todoService } = require('../services')

const createTodo = async (req, res) => {
  try {
    const todo = await todoService.createTodo(req.body)
    res.status(201).json(todo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getTodos = async (req, res) => {
  try {
    const todos = await todoService.getTodos()
    res.json(todos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getTodoById = async (req, res) => {
  try {
    const { id } = req.params
    const todo = await todoService.getTodoById(id)
    if (todo) {
      res.json(todo)
    } else {
      res.status(404).json({ error: 'Todo not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params
    const updatedTodo = await todoService.updateTodo(id, req.body)
    res.json(updatedTodo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params
    const result = await todoService.deleteTodo(id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
}
