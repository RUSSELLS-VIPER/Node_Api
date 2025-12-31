const swaggerJSDoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node API',
            version: '1.0.0',
            description: 'API documentation for Node API'
        },
        servers: [
            {
                url: 'http://localhost:4000/api'
            }
        ]
    },
    apis: ['./routes/*.js', './controllers/*.js', './models/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
