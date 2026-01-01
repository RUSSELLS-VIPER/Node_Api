const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node API',
            version: '1.0.0',
            description: 'API documentation for Node API',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development server'
            },
            {
                url: 'https://your-app.onrender.com', // Update with your Render URL
                description: 'Production server'
            }
        ],
        components: {
            schemas: {},
            securitySchemes: {}
        },
        tags: [
            {
                name: 'Users',
                description: 'User management operations'
            }
        ]
    },
    apis: [
        './swagger/schemas/*.js',
        './swagger/paths/*.js',
        './routes/*.js'
    ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
