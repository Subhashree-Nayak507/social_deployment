import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const CreatePostController = async (req, res) => {
    try {
        const { text } = req.body;
        let img = null;
        if (req.file) {
            img = req.file.path;  
        }
        if (!text && !img) {
            return res.status(500).json({
                message: "Provide Either Image or text for a post"
            });
        }
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
		if (!user)
             return res.status(404).json({ message: "User not found" });
    
        const newPost = new Post({
            user: userId,
            text,
            img,  
        });

        await newPost.save();
        res.status(201).json({
            message: "Successfully created a post",
            newPost
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
};

export const deletePostController = async (req, res) => {
    try {
        const postId = req.params.id.trim(); 
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid post ID format" });
        }

        console.log("post", post.user);
        console.log("userid", req.user._id);

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }
        if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Successfully deleted a post",
           
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
};

