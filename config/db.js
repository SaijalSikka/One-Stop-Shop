import mongoose from "mongoose";
const connectDB=async() =>{
    try{
        const mongoURL=process.env.MONDODB_URL;
        const conn=await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to the database");
    } catch(error){
        console.log("Database connection error:", error);
    }
}
export default connectDB; 
