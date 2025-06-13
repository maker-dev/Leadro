import express from 'express';
import cors from 'cors'
import morgan from 'morgan'
import errorHandler from './middlewares/errorHandler.js'
import userRoutes from './routes/user.routes.js'
import leadRoutes from './routes/lead.routes.js'
import passwordRoutes from './routes/password.routes.js'
import apikeyRoutes from './routes/apikey.routes.js'

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

//routes
app.use('/api/users', userRoutes); 
app.use('/api/leads', leadRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/apikey', apikeyRoutes);

//error handler
app.use(errorHandler);

export {app}
