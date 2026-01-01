const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

const app = express();
app.use(express.json());

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Debug MongoDB endpoint
app.get('/debug/mongodb', (req, res) => {
    const mongoose = require('mongoose');
    const connectionState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.json({
        mongodb: states[connectionState] || 'unknown',
        connectionStringSet: !!process.env.MONGO_URL
    });
});

// Home route
app.get('/', (req, res) => {
    const endpoints = [
        { method: 'POST', path: '/users/create', description: 'Create a user' },
        { method: 'GET', path: '/users', description: 'Get all users' },
        { method: 'GET', path: '/users/:id', description: 'Get user by ID' },
        { method: 'PUT', path: '/users/:id', description: 'Update a user' },
        { method: 'DELETE', path: '/users/:id', description: 'Delete a user' }
    ];
    res.render('index', { endpoints });
});

// API Routes - REMOVED /api prefix
app.use('/users', require('./routes/userRoutes'));

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "API Documentation"
}));

// Serve Swagger JSON
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Handle 404 for all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: [
            { method: 'POST', path: '/users/create', description: 'Create a user' },
            { method: 'GET', path: '/users', description: 'Get all users' },
            { method: 'GET', path: '/users/:id', description: 'Get user by ID' },
            { method: 'PUT', path: '/users/:id', description: 'Update a user' },
            { method: 'DELETE', path: '/users/:id', description: 'Delete a user' }
        ]
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API Documentation: http://localhost:${PORT}/docs`);
    console.log(`Debug MongoDB: http://localhost:${PORT}/debug/mongodb`);
});
