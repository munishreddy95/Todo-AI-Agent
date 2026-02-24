const router = require('express').Router()
const todoRoutes = require('./todo.route')
const agentRoutes = require('./agent.route')

router.use('/todos', todoRoutes)
router.use('/agent', agentRoutes)

module.exports = router
