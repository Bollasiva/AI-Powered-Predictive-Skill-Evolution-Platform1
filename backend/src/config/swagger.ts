import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
    apis: ['./src/routes/*.ts'], // Path to the API docs (updated to .ts and src)
};

const specs = swaggerJsDoc(options);

export { swaggerUi, specs };
