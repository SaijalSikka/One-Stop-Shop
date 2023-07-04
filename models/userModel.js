import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true  // to remove whitespaces
    },
    email:{
        type:String,
        required:true,
        unique:true // to make sure that one email id is unique to only one user
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    }
},{timestamps:true})  //timestamps ensures that whenever new user is added to database, that timestamp will be added.
export default mongoose.model("User",userSchema);