import Post from "../models/post.model.js";
import User from "../models/user.model.js";

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
        const userId = req.user;
    
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
        const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

        
        res.status(200).json({
            message: "Successfully deleted a post",
           
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
};

