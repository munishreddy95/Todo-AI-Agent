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
  completed: {
    type: sequelize.Sequelize.BOOLEAN,
    defaultValue: false,
  },
})
module.exports = Todo
