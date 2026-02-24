const runAgent = require('../ai/agent')

exports.handleAgentRequest = async (req, res) => {
  try {
    const { userInput } = req.body
    const response = await runAgent(userInput)
    res.json(response)
  } catch (error) {
    console.error('Error handling agent request:', error.message)
    res.status(500).json({ error: error.message })
  }
}
