const { id } = require('zod/locales')
const { todoModel } = require('../models')

const { Op } = require('sequelize')

function convertFilters(where) {
  const converted = {}

  for (const key in where) {
    const value = where[key]

    if (value.gte || value.lte || value.gt || value.lt || value.eq) {
      converted[key] = {}

      if (value.gte) converted[key][Op.gte] = value.gte
      if (value.lte) converted[key][Op.lte] = value.lte
      if (value.gt) converted[key][Op.gt] = value.gt
      if (value.lt) converted[key][Op.lt] = value.lt
      if (value.eq) converted[key][Op.eq] = value.eq
    }
    if (value.in) {
      converted[key] = {
        [Op.in]:
          typeof value.in == 'object' ? Object.values(value.in) : value.in,
      }
    }
  }

  return converted
}

exports.createTodo = async (task) => {
  try {
    const newTodo = await todoModel.create(task)
    return newTodo
  } catch (error) {
    console.error('Error creating todo:', error)
    throw error
  }
}

exports.getTodos = async (args) => {
  try {
    const sequelizeWhere = convertFilters(args.where || {})
    const selectedFields = args.selected ? Object.values(args.selected) : []
    const limit = args.limit || 20
    const offset = args.offset || 0
    const orderBy = args.orderBy || 'createdAt'
    const orderDirection = args.orderDirection || 'DESC'
    return todoModel.findAll({
      where: sequelizeWhere,
      limit: limit,
      offset: offset,
      order: [[orderBy, orderDirection]],
      attributes: selectedFields,
    })
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

exports.updateTodo = async (args) => {
  const sequelizeWhere = convertFilters(args.where || {})
  const updateFields = args.updates || {}
  try {
    const todo = await todoModel.update(updateFields, {
      where: sequelizeWhere,
    })
    if (todo[0] === 0) {
      throw new Error('Todos not found')
    }
    return todo
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

exports.deleteTodoById = async (id) => {
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

exports.deleteTodo = async (args) => {
  const sequelizeWhere = convertFilters(args.where || {})
  try {
    const deletedCount = await todoModel.destroy({
      where: sequelizeWhere,
    })
    if (deletedCount === 0) {
      throw new Error('Todos not found')
    }
    return { message: 'Todos deleted successfully' }
  } catch (error) {
    console.error('Error deleting todos:', error)
    throw error
  }
}
