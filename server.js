const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.use('/api/users', require('./routes/userRoutes'))

const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
