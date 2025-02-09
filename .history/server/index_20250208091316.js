import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import { connectDB } from './db/connectDb.js';
import UserRouter from './routes/user.routes.js';
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user',UserRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    connectDB();
    console.log(`Server running at http://localhost:${port}`);
});
