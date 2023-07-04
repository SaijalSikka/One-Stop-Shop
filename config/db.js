import mongoose from "mongoose";
const connectDB=async() =>{
    try{
        const conn=await mongoose.connect("mongodb://127.0.0.1/ecomUsersDB", { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to the database");
    } catch(error){
        console.log("Database connection error:", error);
    }
}
export default connectDB;