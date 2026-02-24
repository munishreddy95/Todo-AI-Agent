const { Sequelize } = require('sequelize')

// Create a new Sequelize instance with your database configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // Path to your SQLite database file
  logging: false, // Disable logging; set to console.log to see SQL queries
  dialectOptions: {
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
    timeStamps: true,
  },
})

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = sequelize
