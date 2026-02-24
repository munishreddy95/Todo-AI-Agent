require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./src/routes')

const sequelize = require('./src/config/database')

sequelize
  .sync()
  .then(() => {
    console.log('Database synced successfully')
  })
  .catch((error) => {
    console.error('Error syncing database:', error)
  })

const app = express()
const port = process.env.PORT || 3000

app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
