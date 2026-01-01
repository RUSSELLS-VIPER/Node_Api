const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

const app = express();
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    const endpoints = [
        { method: 'POST', path: '/api/users/create', description: 'Create a user' },
        { method: 'GET', path: '/api/users', description: 'Get all users' },
        { method: 'GET', path: '/api/users/:id', description: 'Get user by ID' },
        { method: 'PUT', path: '/api/users/:id', description: 'Update a user' },
        { method: 'DELETE', path: '/api/users/:id', description: 'Delete a user' }
    ];
    res.render('index', { endpoints });
});

app.use('/api/users', require('./routes/userRoutes'));

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        error: 'API endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});
