import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';

// Routes 
const app = express();

// MiddleWare 
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors())
// to server images for public 
app.use(express.static('public'));
app.use('/images', express.static('images'));

dotenv.config()

mongoose.connect(
    process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => app.listen(process.env.PORT, () => console.log(`Listening at ${process.env.PORT}`)))
    .catch((error) => console.error(error));

// usage of routes 
app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/posts', PostRoute)
app.use('/upload', UploadRoute)