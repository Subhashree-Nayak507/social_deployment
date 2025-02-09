import express from "express";
import { protectRoute } from "../middleware/check.auth.js";

const notificationRouter= express.Router();

notificationRouter.get('/',protectRoute)
notificationRouter.delete('/',protectRoute)

export default notificationRouter;