import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js" ;
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import cors from 'cors';
import path from "path";
dotenv.config();
connectDB();
const app=express();

//routes

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"./client/build")));

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/products",productRoutes);


app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"))
})
const PORT=process.env.PORT;
app.listen(PORT,function(){
    console.log("server is active ");
});