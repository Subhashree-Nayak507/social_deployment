import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import { connectDB } from './db/connectDb.js';

dotenv.config();
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    connectDB();
    console.log(`Server running at http://localhost:${port}`);
});
