import express from 'express';
import cors from 'cors'
import morgan from 'morgan'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import errorHandler from './middlewares/errorHandler.js'
import userRoutes from './routes/user.routes.js'
import leadRoutes from './routes/lead.routes.js'
import passwordRoutes from './routes/password.routes.js'
import apikeyRoutes from './routes/apikey.routes.js'

const app = express();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Leadro API Documentation',
            version: '1.0.0',
            description: 'API documentation for Leadro application',
            contact: {
                name: 'API Support',
                email: 'support@leadro.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.routes.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes
app.use('/api/users', userRoutes); 
app.use('/api/leads', leadRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/apikey', apikeyRoutes);

//error handler
app.use(errorHandler);

export {app}
