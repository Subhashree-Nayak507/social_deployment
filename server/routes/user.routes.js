import express from "express";
import { protectRoute } from "../middleware/check.auth.js";
import { FollowUnfollowUsersController, getProfileController, suggestedUserController,  updateProfileDataController,
     updateProfileFilesController} from "../controllers/user.controller.js";
import { upload } from "../middleware/uploadImage.js";

const UserRouter = express.Router();

UserRouter.get("/profile/:username",protectRoute,getProfileController);
UserRouter.get("/suggested",protectRoute,suggestedUserController);
UserRouter.post("/Follow/:id",protectRoute,FollowUnfollowUsersController);
UserRouter.post( "/updateProfileFiles", protectRoute,
     upload.fields([
         { name: 'profileImg', optional: true },
         { name: 'coverImg', optional: true }
     ]),
     updateProfileFilesController
 );
UserRouter.post("/updateProfileData",protectRoute,updateProfileDataController);

export default UserRouter;