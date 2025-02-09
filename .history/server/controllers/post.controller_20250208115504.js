import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const CreatePostController = async( req,res)=>{
    try{
        const { text, img } = req.body;
        if (!text && !img){
            return res.status(500).json({
                message:"Provide Either Image or text for a post"
            })
        }
        
        const userId=req.user;
        const user= User.findById(userId);
        console.log("user",user);

        if (img){
            const path = req.file.path
        };
        const newPost = new Post({
			user: userId,
			text,
			img,
		});

		await newPost.save();
		res.status(201).json({
            message:"successfully created a post",
            newPost
        });
    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({ message:"Internal server Error"});
    }
};