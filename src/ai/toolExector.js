const { todoService } = require('../services')
const yup = require('yup')
const { Op } = require('sequelize')

const updateSchema = yup.object({
  id: yup.number().required(),

  task: yup
    .string()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() === '') {
        return undefined
      }
      return value?.trim()
    })
    .optional(),

  completed: yup.boolean().optional(),
})

async function executeTool(name, args) {
  console.log(name, args)
  switch (name) {
    case 'createTodo':
      return await todoService.createTodo(args.task)

    case 'getTodos':
      return await todoService.getTodos(args)

    case 'countTodos':
      return await todoService.getTodosCount()

    case 'getTodoById':
      return await todoService.getTodoById(args.id)

    case 'deleteTodo':
      return await todoService.deleteTodo(args.id)

    case 'updateTodo':
      const { id, ...body } = await updateSchema.validate(args, {
        stripUnknown: true,
      })
      return await todoService.updateTodo(id, body)
    case 'getTodosForToday':
      const today = new Date()
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      )

      console.log({ $gte: startOfDay, $lt: endOfDay })

      return await todoService.getTodos({
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      })

    case 'getTodosCountForToday':
      const todayCount = new Date()
      const startOfDayCount = new Date(
        todayCount.getFullYear(),
        todayCount.getMonth(),
        todayCount.getDate()
      )
      const endOfDayCount = new Date(
        todayCount.getFullYear(),
        todayCount.getMonth(),
        todayCount.getDate() + 1
      )

      return await todoService.getTodosCount({
        createdAt: {
          [Op.gte]: startOfDayCount,
          [Op.lt]: endOfDayCount,
        },
      })

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

module.exports = executeTool
