const createTodoTool = {
  type: 'function',
  name: 'createTodo',
  description: `
    This tool is strictly for creating new tasks. Never use for updates or modifications.

    Routing:
    - Use ONLY when user intends to add or create a new task.
    - Never use for modifications.

    Arguments Rules:
    - Only include fields explicitly mentioned by the user.
    - If user does not provide a due date, then add a due date with 2 days from now. This is not considered inventing data, but rather filling in a reasonable default for missing information.

    Use this tool if user mentions:
    - add
    - create
    - new task
    - schedule (but only if it clearly indicates creating a new task, not modifying an existing one)

    Do NOT use this tool if user mentions:
    - modify
    - update
    - change
    - mark
    - set
    - edit
    - reschedule
    - move  
    `,
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      additionalProperties: false,
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
    minProperties: 1,
    required: ['task'],
  },
}

const getTodosTool = {
  type: 'function',
  name: 'listTodos',
  description: `
    This tool is strictly for retrieving tasks. Never use for updates or modifications.

    Routing:
    - Use ONLY when user intends to view, list, check, or retrieve tasks.
    - Never use for modifications.

    Arguments Rules:

    1. Filters go inside "where".
    2. Fields go inside "selected" (must be an array).
    3. "selected" must ALWAYS be present in the output.

    Field Selection Logic:
    - If the user specifies fields → use only those fields.
    - If the user does NOT specify fields → set:
      selected = ["id", "task", "status", "priority", "dueDate", "createdAt"].
    - Do NOT select all database columns unless explicitly requested.

    Time Handling:
    - For relative ranges (today, past 2 days, last week, etc.)
      - Generate both start and end boundaries.
      - End boundary must be current server time.
`,
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      where: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                additionalProperties: false,
                items: {
                  type: 'integer',
                },
              },
            },
          },
          status: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                additionalProperties: false,
                items: {
                  type: 'string',
                  enum: ['pending', 'in_progress', 'completed'],
                },
              },
            },
          },
          priority: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                additionalProperties: false,
                items: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                },
              },
            },
          },
          dueDate: {
            type: 'object',
            additionalProperties: false,
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
            additionalProperties: false,
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
        minProperties: 0,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
      },
      orderBy: {
        type: 'string',
        enum: ['id', 'task', 'createdAt', 'dueDate', 'priority', 'status'],
      },
      orderDirection: {
        type: 'string',
        enum: ['asc', 'desc'],
      },
      selected: {
        type: 'array',
        additionalProperties: false,
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
      This tool is strictly for modifying existing tasks. Never use for creating new tasks.
      Routing:
      - Use ONLY when user intends to modify, update, change, mark, set, edit, reschedule, or move existing tasks.
      - Never use for creating new tasks.

      Arguments Rules:
      1. Filters go inside "where".
      2. Fields to modify go inside "updates".
      3. Only include explicitly mentioned fields in both "where" and "updates". Never invent or assume missing information.
      4. Do NOT use this tool if the user's intent is to create a new task. In such cases, use the "createTodo" tool instead.   
`,
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      where: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                additionalProperties: false,
                items: {
                  type: 'integer',
                },
              },
            },
          },
          status: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                additionalProperties: false,

                items: {
                  type: 'string',
                  enum: ['pending', 'in_progress', 'completed'],
                },
              },
            },
          },
          priority: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                additionalProperties: false,

                items: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                },
              },
            },
          },
          dueDate: {
            type: 'object',
            additionalProperties: false,
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
            additionalProperties: false,
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
        minProperties: 1,
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
        minProperties: 1,
      },
    },
    required: ['where', 'updates'],
  },
}

const deleteTodos = {
  type: 'function',
  name: 'bulkDeleteTodos',
  description: `
    Use this tool if user mentions:
    - delete
    - remove
    - erase
    - clear

    Filters go inside "where".
`,
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      where: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                additionalProperties: false,
                items: {
                  type: 'integer',
                },
              },
            },
          },
          status: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                additionalProperties: false,
                items: {
                  type: 'string',
                  enum: ['pending', 'in_progress', 'completed'],
                },
              },
            },
          },
          priority: {
            type: 'object',
            additionalProperties: false,
            properties: {
              in: {
                type: 'array',
                additionalProperties: false,
                items: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                },
              },
            },
          },
          dueDate: {
            type: 'object',
            additionalProperties: false,
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
            additionalProperties: false,
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
        minProperties: 1,
      },
    },
  },
}

module.exports = [createTodoTool, getTodosTool, updateTodoTool, deleteTodos]
