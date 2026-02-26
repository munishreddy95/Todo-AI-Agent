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
        [Op.in]: value.in,
      }
    }
  }

  return converted
}

function normalizeInOperator(obj) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const values = Object.values(obj)
    if (values.length > 0 && values.every((v) => typeof v === 'string')) {
      return values
    }
  }
  return obj
}

exports.createTodo = async (task) => {
  try {
    const newTodo = await todoModel.create({ task })
    return newTodo
  } catch (error) {
    console.error('Error creating todo:', error)
    throw error
  }
}

function applyFieldSelection(args, allowedFields = []) {
  const fieldsToApplyArray = Object.values(args || [])
  if (!Array.isArray(fieldsToApplyArray)) {
    return {}
  }

  const selected = {}

  for (const field of fieldsToApplyArray) {
    if (
      allowedFields.includes(field) &&
      args[field] !== undefined &&
      args[field] !== null &&
      args[field] !== ''
    ) {
      selected[field] = args[field]
    }
  }

  return selected
}

const FIELD_MAPPERS = {
  id: (value, where) => {
    where.id = value
  },
  status: (value, where) => {
    where.status = value
  },
  priority: (value, where) => {
    where.priority = value
  },
  task: (value, where) => {
    where.task = { [Op.like]: `%${value}%` }
  },
  dueBefore: (value, where) => {
    where.dueDate = where.dueDate || {}
    where.dueDate[Op.lt] = new Date(value)
  },
  dueAfter: (value, where) => {
    where.dueDate = where.dueDate || {}
    where.dueDate[Op.gt] = new Date(value)
  },
  createdBefore: (value, where) => {
    where.createdAt = where.createdAt || {}
    where.createdAt[Op.lt] = new Date(value)
  },
  createdAfter: (value, where) => {
    where.createdAt = where.createdAt || {}
    where.createdAt[Op.gt] = new Date(value)
  },
}

exports.getTodos = async (args) => {
  try {
    const sequelizeWhere = {}

    sequelizeWhere = convertFilters(args.where || {})

    const selectedFields = args.selected || []

    for (const field in filteredArgs) {
      FIELD_MAPPERS[field](filteredArgs[field], sequelizeWhere)
    }
    return todoModel.findAll({
      where: sequelizeWhere,
      limit: 20,
      order: [['createdAt', 'DESC']],
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
  const sequelizeWhere = {}

  console.log(args.where.status)

  sequelizeWhere = convertFilters(args.where || {})

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
