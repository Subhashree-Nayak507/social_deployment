import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";

export const getProfileController = async(req,res)=>{
    try{
        const { username }= req.params;

        const checkUser=await User.findOne ({ username }).select("-password");
        if(!checkUser){
             return res.status(400).json({ message:"user not found"});
        };
		
        return  res.status(200).json({ 
            message:"profile obtained successfully",
           checkUser
        });

    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({ message:"Internal server Error"});
    };
};

export const suggestedUserController= async(req,res)=>{
    try{
     const CurrentUser= req.user;
     const followingList = CurrentUser.following;

     const suggestedUsers = await User.find({
        _id: { $nin: followingList }, 
        _id: { $ne: CurrentUser._id } 
      }).select('-password').limit(7);   

       return res.status(200).json({  
        message:"profile obtained successfully",
        suggestedUsers
     });
    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({ message:"Internal server Error"});
    }
};

export const FollowUnfollowUsersController= async(req,res)=>{
    try{
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
			return res.status(400).json({ message: " you can't follow yourself" });
		};
		if (!userToModify || !currentUser)
             return res.status(400).json({ message: "User not found" });

        const isFollowing = currentUser.following.includes(id);
        if( isFollowing){
            //if fpollow then follow the user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
        }else{
            // update user to modify and current user followers and following.
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

        }
        const newNotification = new Notification({
            type: "follow",
            from: req.user._id,
            to: userToModify._id,
        });
        await newNotification.save();
        
     return res.status(200).json({ message: "User followed successfully" ,
        isFollowing
     });
    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({ message:"Internal server Error"});
    }
};

export const updateProfileController= async(req,res)=>{
    try{
        const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
        let { profileImg, coverImg } = req.body;
    
        let user = await User.findById(req.user._id);
       // console.log(user);
        if (!user) 
            return res.status(404).json({ message: "User not found" });

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		};

        if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		};

        if ( req.files.profileImg) {
           // console.log(req.files);
            try {
                if (user.profileImg) {
                    const publicId = user.profileImg.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                user.profileImg = req.files.profileImg[0].path;
            } catch (error) {
                console.error("Error handling profile image:", error);
            }
        }

        if ( req.files.coverImg) {
            try {
                if (user.coverImg) {
                    const publicId = user.coverImg.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                user.coverImg = req.files.coverImg[0].path;
            } catch (error) {
                console.error("Error handling cover image:", error);
            }
        }

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();
		user.password = null;

		return res.status(200).json({
            messsage:"  user profile  updated successfully",
            user
        });

    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({
             message:"Internal server Error"});
    }
};

export const searchUserController = async(req,res)=>{
    try{
    const { fullName } = req.query;
    if (!fullName) {
      return res.status(400).json({ error: "Please provide a name." });
    };

    const users = await User.find({
        fullName: { $regex: fullName, $options: 'i' } 
      }).select('-password'); 

      if (users.length === 0) {
        return res.status(404).json({ message: "No users found." });
      };

      return res.status(200).json({
        messsage:" Found user profile  successfully",
         users 
        });
    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({ message:"Internal server Error"});
    }
}