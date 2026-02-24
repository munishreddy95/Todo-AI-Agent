const tools = require('./tools')
const openai = require('./openai')
const executeTool = require('./toolExector')

async function runAgent(userInput) {
  try {
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      tools: tools,
      input: [
        {
          role: 'system',
          content: `
                You are a todo management assistant.
                When the user asks to mark a task as completed or change its status,
                you should call updateTodo with completed: true.
                Only call getTodoById if the user explicitly asks to view a task.

                If the user clearly requests an update, deletion, or status change,
                you must immediately call the appropriate tool.

                Do not ask for confirmation unless the user intent is ambiguous.
                `,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
    })

    while (true) {
      const toolCalls = response.output.filter(
        (item) => item.type === 'function_call'
      )

      if (toolCalls.length === 0) {
        return response.output_text
      }
      const toolOutputs = []
      for (const call of toolCalls) {
        const result = await executeTool(call.name, JSON.parse(call.arguments))
        toolOutputs.push({
          type: 'function_call_output',
          call_id: call.call_id,
          output: JSON.stringify(result),
        })
      }
      return {
        message: 'Agent execution completed',
        toolOutputs,
      }
    }
  } catch (error) {
    console.error('Error running agent:', error)
    throw error
  }
}

module.exports = runAgent
