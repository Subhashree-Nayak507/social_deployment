import express from "express";
import { protectRoute } from "../middleware/check.auth.js";
import { deleteNoficationsController, getNoficationsController } from "../controllers/notification.controller.js";

const notificationRouter= express.Router();

notificationRouter.get('/',protectRoute,getNoficationsController);
notificationRouter.delete('/',protectRoute,deleteNoficationsController);

export default notificationRouter;