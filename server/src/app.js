import express from 'express';
import cors from 'cors'
import morgan from 'morgan'
import userRoutes from './routes/user.routes.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

//routes
app.use('/api/users', userRoutes); 

//error handler
app.use(errorHandler);

export {app}
