const tools = [
  {
    name: 'createTodo',
    type: 'function',
    description: 'Add a new todo item',
    parameters: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'The task description for the new todo item',
        },
      },
      required: ['task'],
    },
  },
  {
    name: 'countTodos',
    type: 'function',
    description: 'Count all todo items',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'getTodos',
    type: 'function',
    description: 'Retrieve all todo items with optional filters',
    parameters: {
      type: 'object',
      properties: {
        completed: {
          type: 'boolean',
          description: 'Filter todos by completion status (true or false)',
        },
        createdAt: {
          type: 'string',
          description: `Filter todos created after a specific date (ISO format).`,
        },
      },
      required: [],
    },
  },
  {
    name: 'getTodosForToday',
    type: 'function',
    description:
      'Retrieve all todo items for today with optional filters. completed status should be removed from the response if status not mentioned in the input. Dont ask for completed status if not mentioned in the input.',
    parameters: {
      type: 'object',
      properties: {
        completed: {
          type: 'boolean',
          description: 'Filter todos by completion status (true or false)',
        },
        createdAt: {
          type: 'string',
          description: `Filter todos created after a specific date (ISO format).`,
        },
      },
      required: [],
    },
  },
  {
    name: 'getTodoById',
    type: 'function',
    description: 'Retrieve a specific todo item by its ID',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          description: 'The unique identifier of the todo item',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'updateTodo',
    type: 'function',
    description:
      'Update a todo item by ID. Use this tool when the user wants to modify the task text or change its completion status. Only include the fields that need to be updated. Do NOT include fields that should remain unchanged.',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          description: 'The unique identifier of the todo item to update.',
        },
        task: {
          type: 'string',
          description:
            'New task description. Include this field ONLY if the user explicitly requests changing the task text. Do NOT send empty string.',
        },
        completed: {
          type: 'boolean',
          description:
            'Set to true to mark the task as completed, or false to mark it as pending. Include this field ONLY if the user wants to change completion status.',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'deleteTodo',
    type: 'function',
    description: 'Delete a specific todo item by its ID',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          description: 'The unique identifier of the todo item to delete',
        },
      },
      required: ['id'],
    },
  },
]

module.exports = tools
