const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Predictive Skill Evolution Platform API',
            version: '1.0.0',
            description: 'API Documentation for the AI-Powered Skill Evolution Platform',
            contact: {
                name: 'Developer Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local development server',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs,
};
