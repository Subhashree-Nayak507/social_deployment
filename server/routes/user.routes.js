import express from "express";
import { protectRoute } from "../middleware/check.auth.js";
import { FollowUnfollowUsersController, getProfileController, searchUserController,
     suggestedUserController, updateProfileController} from "../controllers/user.controller.js";

const UserRouter = express.Router();

UserRouter.get("/profile/:username",protectRoute,getProfileController);
UserRouter.get("/suggested",protectRoute,suggestedUserController);
UserRouter.post("/Follow/:id",protectRoute,FollowUnfollowUsersController);
UserRouter.post("/updateProfile",protectRoute,updateProfileController);
UserRouter.get("/search",protectRoute,searchUserController);

export default UserRouter;