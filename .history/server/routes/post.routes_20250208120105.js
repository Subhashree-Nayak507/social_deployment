import express from "express";
import { protectRoute } from "../middleware/check.auth.js";
import { CreatePostController } from "../controllers/post.controller.js";
import { upload } from "../middleware/uploadImage.js";

const PostRouter= express.Router();

PostRouter.post("/create", protectRoute,
    upload.single(
        { name: 'img', optional: true },
       )
    ,CreatePostController);
PostRouter.post("/like/:id", protectRoute);
PostRouter.post("/comment/:id", protectRoute);
PostRouter.delete("/:id", protectRoute);


export default PostRouter;