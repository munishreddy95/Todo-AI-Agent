const tools = require('./tools')

const openai = require('./openai')
const executeTool = require('./toolExector')

function deepSanitize(obj) {
  if (typeof obj !== 'object' || obj === null) return obj

  const cleaned = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value === '' || value === null || value === undefined) {
      continue
    }

    if (typeof value === 'object') {
      const nested = deepSanitize(value)
      if (Object.keys(nested).length === 0) continue
      cleaned[key] = nested
    } else {
      cleaned[key] = value
    }
  }

  return cleaned
}

function detectIntent(userInput) {
  const text = userInput.toLowerCase()

  // Priority order matters
  const priorityOrder = ['createTodo', 'updateTodo', 'deleteTodo', 'getTodos']

  for (const intent of priorityOrder) {
    const keywords = intentKeywords[intent]

    for (const word of keywords) {
      if (text.includes(word)) {
        return intent
      }
    }
  }

  // Default fallback
  return 'getTodos'
}

async function runAgent(userInput) {
  try {
    const now = new Date().toISOString()

    // const forcedTool = detectIntent(userInput)
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      temperature: 0,
      input: [
        {
          role: 'system',
          content: `
              You are a strict backend tool-calling AI.

              Current server time: ${now}
              User timezone: Asia/Kolkata (UTC+05:30)
              Convert all dates to UTC ISO format.

              Intent Priority (Strict Order):
              1. Create → createTodo
              2. Modify/Mark/Set/Change → updateTodo
              3. View/List/Check → getTodos
              Modification intent overrides retrieval.

              Tool Rules:
              - Only include fields explicitly mentioned.
              - Never invent defaults.
              - Never include null or empty fields.
              - Do not guess missing data.
              `,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      tools: tools,
    })

    while (true) {
      const toolCalls = response.output.filter(
        (item) => item.type === 'function_call'
      )

      if (toolCalls.length === 0) {
        return response.output_text
      }
      const toolOutputs = []
      const output = []
      for (const call of toolCalls) {
        const parsedArgs = JSON.parse(call.arguments)
        const sanitizedArgs = deepSanitize(parsedArgs)
        const result = await executeTool(call.name, sanitizedArgs)
        toolOutputs.push({
          type: 'function_call_output',
          call_id: call.call_id,
          output: JSON.stringify(result),
        })

        output.push({
          role: call.name,
          content: result,
        })
      }
      return {
        message: 'Agent execution completed',
        output,
      }
    }
  } catch (error) {
    console.error('Error running agent:', error)
    throw error
  }
}

module.exports = runAgent
