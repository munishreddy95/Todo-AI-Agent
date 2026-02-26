const { gt } = require('zod')

const createTodoTool = {
  type: 'function',
  name: 'createTodo',
  description: `
Create a new todo item.
Use ONLY when user intends to add or create a new task.
Never use for modifications.
`,
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      task: { type: 'string', minLength: 1 },
      description: { type: 'string' },
      status: {
        type: 'string',
        enum: ['pending', 'in_progress', 'completed'],
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
      },
      dueDate: {
        type: 'string',
        format: 'date-time',
      },
    },
    required: ['task'],
  },
}

const getTodosTool = {
  type: 'function',
  name: 'listTodos',
  description: `
  filters go inside "where".
  fields to select go inside "selected" array.
  Use ONLY when user intends to view, list, check, or retrieve tasks.
  Never use for modifications or updates.

  this tool is not for updating or modifying tasks in any way. Only for retrieval.

Time Handling Exception:
- For relative date ranges like "past 2 days", "last week", "today", "tomorrow", "last week day to till now" etc.,
  you MUST generate both start and end boundaries.
- The end boundary is the current server time.
- This is not considered inventing data.
`,
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      where: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          status: {
            type: 'object',
            in: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['pending', 'in_progress', 'completed'],
              },
            },
          },
          priority: {
            type: 'object',
            in: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['low', 'medium', 'high'],
              },
            },
          },
          dueDate: {
            type: 'object',
            properties: {
              gte: { type: 'string', format: 'date-time' },
              lte: { type: 'string', format: 'date-time' },
              gt: { type: 'string', format: 'date-time' },
              lt: { type: 'string', format: 'date-time' },
              eq: { type: 'string', format: 'date-time' },
            },
          },
          createdAt: {
            type: 'object',
            properties: {
              gte: { type: 'string', format: 'date-time' },
              lte: { type: 'string', format: 'date-time' },
              gt: { type: 'string', format: 'date-time' },
              lt: { type: 'string', format: 'date-time' },
              eq: { type: 'string', format: 'date-time' },
            },
          },
          task: { type: 'string' },
        },
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
      },
      orderBy: {
        type: 'string',
        enum: ['createdAt', 'dueDate', 'priority', 'status'],
      },
      orderDirection: {
        type: 'string',
        enum: ['asc', 'desc'],
      },
      selected: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'id',
            'task',
            'description',
            'status',
            'priority',
            'dueDate',
            'createdAt',
          ],
        },
      },
    },
  },
}

const updateTodoTool = {
  type: 'function',
  name: 'bulkUpdateTodos',
  description: `
Update existing todos.

Use this when user intends to modify, change, mark, set, or update tasks.
Filters go inside "where".
Fields to modify go inside "updates".
Only include explicitly mentioned fields.
`,
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      action: {
        type: 'string',
        enum: ['update'],
      },
      where: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          status: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['pending', 'in_progress', 'completed'],
                },
              },
            },
          },
          priority: {
            type: 'object',
            in: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['low', 'medium', 'high'],
              },
            },
          },
          dueDate: {
            type: 'object',
            properties: {
              gte: { type: 'string', format: 'date-time' },
              lte: { type: 'string', format: 'date-time' },
              gt: { type: 'string', format: 'date-time' },
              lt: { type: 'string', format: 'date-time' },
              eq: { type: 'string', format: 'date-time' },
            },
          },
          createdAt: {
            type: 'object',
            properties: {
              gte: { type: 'string', format: 'date-time' },
              lte: { type: 'string', format: 'date-time' },
              gt: { type: 'string', format: 'date-time' },
              lt: { type: 'string', format: 'date-time' },
              eq: { type: 'string', format: 'date-time' },
            },
          },
          task: { type: 'string' },
        },
      },
      updates: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task: { type: 'string' },
          description: { type: 'string' },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'completed'],
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
          },
          dueDate: { type: 'string', format: 'date-time' },
        },
      },
    },
    required: ['where', 'updates'],
  },
}

module.exports = [createTodoTool, getTodosTool, updateTodoTool]
