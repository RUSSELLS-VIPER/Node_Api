const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()
app.use(express.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    const endpoints = [
        { method: 'POST', path: '/users/create', description: 'Create a user' },
        { method: 'GET', path: '/users', description: 'Get all users' },
        { method: 'GET', path: '/users/:id', description: 'Get user by ID' },
        { method: 'PUT', path: '/users/:id', description: 'Update a user' },
        { method: 'DELETE', path: '/users/:id', description: 'Delete a user' }
    ]
    res.render('index', { endpoints })
})

app.use('/users', require('./routes/userRoutes'))

const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
