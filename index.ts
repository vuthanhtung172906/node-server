import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
/// Database
import routes from './routes';

//Middlewares

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
import './config/database';

// Routes
app.use('/api', routes.useRoute);

app.get('/', (req, res) => {
  res.json({ msg: 'main page' });
});

// Server listening

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server is running on PORT', PORT);
});
