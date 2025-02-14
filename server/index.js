import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import { connectDB } from './db/connectDb.js';
import UserRouter from './routes/user.routes.js';
import PostRouter from './routes/post.routes.js';
import notificationRouter from './routes/notification.routes.js';
import path from "path";

dotenv.config();
const app = express();
const __dirname = path.resolve()

app.use(express.json({ limit: "5mb" })); // to parse req.body
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user',UserRouter);
app.use('/api/post',PostRouter);
app.use('/api/notification',notificationRouter);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}

const port = process.env.PORT || 4000;
app.listen(port, () => {
    connectDB();
    console.log(`Server running at http://localhost:${port}`);
});
