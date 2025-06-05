import dotenv from 'dotenv';
import {app} from './src/app.js';
import connectDB from './src/config/db.js';

//config env
dotenv.config();

//variables
const PORT = process.env.PORT || 8080;

//server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})