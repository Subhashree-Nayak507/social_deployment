
import Notification from "../models/notification.model.js";
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
        const userId = req.user._id;
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
        const postId = req.params.id; 
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        };
        // console.log("post", post.user);
        // console.log("userid", req.user._id.toString());
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
            post
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
};

export const commentController = async (req, res) => {
 try{
        const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		};

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		};

		const comment = { user: userId, text };
		post.comments.push(comment);

		await post.save();
		res.status(200).json({
            message:"comment added successfully",
            post
        });

 }catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
};

export const likeUnlikeController = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id; 
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        let updatedPost;
        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike logic
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                { $pull: { likes: userId } },
                { new: true }
            );
            await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
           // console.log("updatedpost,",updatedPost.likes)

            return res.status(200).json({
                message: "Successfully unliked the post",
                updatedLikes: updatedPost.likes, 
            });

        } else {
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                { $push: { likes: userId } },
                { new: true }
            );
            await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
        //    console.log("updatedpost,",updatedPost.likes);
             console.log("post liked",post.user);
            if (post.user) {
                const newNotification = new Notification({
                    from: userId,
                    to: post.user,
                    type: "like",
                });
                await newNotification.save();
            }

            return res.status(200).json({
                message: "Successfully liked the post",
                updatedLikes: updatedPost.likes 
            })
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllPostController=async(req,res)=>{
    try{
        const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}
      res.status(200).json({
        message:"succesfully retrieved the all posts",
        posts
      })
    }catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getLikedPostController= async(req,res)=>{
    try{
        const userId= req.params.id;
        const user= await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        };

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });
        console.log("liked post are",likedPosts);
        res.status(200).json({
            message:"succesfully retrieved the liked post by posts",
            posts: likedPosts 
          });
        
    }catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getFollowingPostController= async(req,res)=>{
    try{
     const userId= req.user._id;
     const user= await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        };
    const following = user.following;
     const posts= await Post.find({ user:{$in: following}})
     .sort({ createdAt : -1 })
     .populate({
        path: "user",
        select: "-password",
    }).populate({
        path: "comments.user",
        select: "-password",
    });

    res.status(200).json({
        message:"succesfully retrieved the following posts",
        posts
      })
    }catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getUserPostController= async(req,res)=>{
    try{
        const { username } = req.params;
        const user= await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        };

        const posts = await Post.find({ user: user._id })
		.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});
            res.status(200).json({
                message:"succesfully retrieved the the post",
                posts
              });
    }catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
 }