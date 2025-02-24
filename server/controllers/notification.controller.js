import Notification from "../models/notification.model.js";

export const getNoficationsController= async(req,res)=>{
    try{
     const userId = req.user._id;
     const notifications= await Notification.find({ to :userId}).populate({
        path: "from",
		select: "username profileImg",
     });
     await Notification.updateMany(
        { to: userId }, { read: true }
      );
    console.log("notifications",notifications);
    
     return  res.status(200).json({ 
        message:"Notification obtained successfully",
       notifications
    })
    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({ message:"Internal server Error"});
    };
};

export const deleteNoficationsController= async(req,res)=>{
    try{
        const userId = req.user._id;
		await Notification.deleteMany({ to: userId });

     return  res.status(200).json({ 
        message:"Notification deleted successfully",
     })
    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({ message:"Internal server Error"});
    };
}