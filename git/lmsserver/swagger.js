const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config({ path: '.env' }).parsed;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Suresh Software Center",
            version: "1.0.0",
            description: "API Documentation",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: "Local server",
            },
            {
                url: `http://localhost:${process.env.PORT}`,
                description: "Development",
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
    app.use('/apis', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
