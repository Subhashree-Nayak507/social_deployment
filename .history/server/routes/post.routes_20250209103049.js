import express from "express";
import { protectRoute } from "../middleware/check.auth.js";
import { commentController, CreatePostController, deletePostController,  getAllPostController,  
    getFollowingPostController,  getLikedPostController,  likeUnlikeController } 
    from "../controllers/post.controller.js";
import { upload } from "../middleware/uploadImage.js";

const PostRouter= express.Router();

PostRouter.get("/all", protectRoute,getAllPostController);
PostRouter.get("/likes/:id", protectRoute,getLikedPostController);
PostRouter.get("/following", protectRoute,getFollowingPostController);

PostRouter.post("/create", protectRoute,upload.single('img') ,CreatePostController);
PostRouter.post("/like/:id", protectRoute,likeUnlikeController);
PostRouter.post("/comment/:id", protectRoute,commentController);
PostRouter.delete("/delete/:id", protectRoute,deletePostController);


export default PostRouter;