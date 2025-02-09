import express from "express";
import { protectRoute } from "../middleware/check.auth.js";

const PostRouter= express.Router();

PostRouter.post("/create", protectRoute);
PostRouter.post("/like/:id", protectRoute);
PostRouter.post("/comment/:id", protectRoute);
PostRouter.delete("/:id", protectRoute);


export default PostRouter;