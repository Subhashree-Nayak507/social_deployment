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

export const suggestedUserController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("following");

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const suggestedUsers = await User.find({
            _id: { $nin: [...currentUser.following, req.user._id] } 
        }).select("-password").limit(7);

        return res.status(200).json({
            message: "Profiles obtained successfully",
            suggestedUsers
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
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
       
        if (isFollowing) {
            // Unfollow the user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            
            return res.status(200).json({ 
                message: "User unfollowed successfully"
            });
        } else {
            //follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            
            console.log("followed user");
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });
            await newNotification.save();

            return res.status(200).json({ 
                message: "User followed successfully",
            });

    }
}catch(error){
    console.log("Error :",error);
    return  res.status(500).json({ message:"Internal server Error"});
}
}

export const updateProfileFilesController = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.files && req.files.profileImg && req.files.profileImg[0]) {
            try {
                if (user.profileImg) {
                    const publicId = user.profileImg.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                user.profileImg = req.files.profileImg[0].path;
            } catch (error) {
                console.error("Error handling profile image:", error);
                return res.status(400).json({ 
                    message: "Error uploading profile image",
                    error: error.message 
                });
            }
        }

        // Handle Cover Image Upload
        if (req.files && req.files.coverImg && req.files.coverImg[0]) {
            try {
                if (user.coverImg) {
                    const publicId = user.coverImg.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                user.coverImg = req.files.coverImg[0].path;
            } catch (error) {
                console.error("Error handling cover image:", error);
                return res.status(400).json({ 
                    message: "Error uploading cover image",
                    error: error.message 
                });
            }
        }

        user = await user.save();
        return res.status(200).json({
            message: "Profile images updated successfully",
            user
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfileDataController = async (req, res) => {
    try {
        const { 
            fullName, 
            email, 
            username, 
            currentPassword, 
            newPassword, 
            bio, 
            link 
        } = req.body;

        let user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ 
                error: "Please provide both current password and new password" 
            });
        }
        console.log("new password",newPassword);
        console.log("current password",currentPassword);
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ 
                    error: "Password must be at least 6 characters long" 
                });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            console.log(" hashed new password",user.password);
        }

        if ('fullName' in req.body) user.fullName = fullName;
        if ('email' in req.body) user.email = email;
        if ('username' in req.body) user.username = username;
        if ('bio' in req.body) user.bio = bio;
        if ('link' in req.body) user.link = link;

        user = await user.save();
        user.password = null;

        return res.status(200).json({
            message: "User profile data updated successfully",
            user
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
