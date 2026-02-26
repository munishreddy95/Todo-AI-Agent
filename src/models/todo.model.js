const sequelize = require('../config/database')

const Todo = sequelize.define('todos', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  task: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: sequelize.Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: sequelize.Sequelize.ENUM,
    values: ['pending', 'in_progress', 'completed'],
    defaultValue: 'pending',
  },
  priority: {
    type: sequelize.Sequelize.ENUM,
    values: ['low', 'medium', 'high'],
    defaultValue: 'medium',
  },
  dueDate: {
    type: sequelize.Sequelize.DATE,
    allowNull: true,
  },
})
module.exports = Todo
