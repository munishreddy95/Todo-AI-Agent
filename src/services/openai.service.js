const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

exports.TodoApiAgent = async (text) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates a todo list based on a given task.',
        },
        {
          role: 'user',
          content: `Generate a todo list for the following task: ${text}`,
        },
      ],
    })

    const todoList = response.data.choices[0].message.content
    return todoList
  } catch (error) {
    console.error('Error generating todo list:', error)
    throw new Error('Failed to generate todo list')
  }
}
