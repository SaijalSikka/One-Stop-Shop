import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
export const requiredSignIn=async(req,res,next)=>{
    try{
        const decode=JWT.verify(req.headers.authorization,process.env.JWT_SECRET);  //encryption part
        req.user=decode; //decryption part
        next();
    } catch(error){
        console.log(error);
    }
}

//admin access
export const isAdmin=async(req,res,next)=>
{
    try{
        const user=await userModel.findById(req.user._id); //since we passed the user in loginController
        if(user.role!==1){
            return res.send({
                success:false,
                message:"Unauthorized access"
            })
        }
        else{
            next();
        }
    } catch(error){
        console.log(error);
        res.send({
            success:false,
            message:"Error in admin Middleware",
            error
        })
    }
}