const router = require('express').Router()
const { agentController } = require('../controllers')

router.route('/').post(agentController.handleAgentRequest)

module.exports = router
