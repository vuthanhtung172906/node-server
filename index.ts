import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import http from 'https';
import express from 'express';
import morgan from 'morgan';
/// Database
import routes from './routes';
import fileUpload from 'express-fileupload';
//Middlewares

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: process.env.PRODUCTION_URL }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
import './config/database';

// Routes
app.use('/api', routes.useRoute);
app.use('/api', routes.uploadRoute);
app.use('/cate', routes.cateRoute);
app.use('/product', routes.productRoute);
app.use('/payment', routes.paymentRoute);
app.get('/', (req, res) => {
  res.json({ msg: 'main page' });
});

// Server listening

const PORT = process.env.PORT || 5000;
setInterval(() => {
  http.get('https://vtt-nodejs.herokuapp.com/');
}, 300000);
app.listen(PORT, () => {
  console.log('Server is running on PORT', PORT);
});
