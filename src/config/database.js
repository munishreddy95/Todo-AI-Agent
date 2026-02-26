const { Sequelize } = require('sequelize')

// Create a new Sequelize instance with your database configuration
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false, // Disable logging; set to console.log to see SQL queries
  timezone: '+05:30', // Set timezone to Asia/Kolkata (UTC+05:30)
  define: {
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
    timestamps: true,
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
