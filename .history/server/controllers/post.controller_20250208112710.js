
export const CreatePostController = async( req,res)=>{
    try{
        
    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({ message:"Internal server Error"});
    }
};