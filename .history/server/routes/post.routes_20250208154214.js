import express from "express";
import { protectRoute } from "../middleware/check.auth.js";
import { CreatePostController, deletePostController } from "../controllers/post.controller.js";
import { upload } from "../middleware/uploadImage.js";

const PostRouter= express.Router();

PostRouter.post("/create", protectRoute,
    upload.single('img')
    ,CreatePostController);
PostRouter.post("/like/:id", protectRoute);
PostRouter.post("/comment/:id", protectRoute);
PostRouter.delete("/delete/:id", protectRoute,deletePostController);


export default PostRouter;