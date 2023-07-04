import express from "express";
import {registerController,loginController,testController,forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from "../controllers/authController.js";
import { requiredSignIn,isAdmin } from "../middlewares/authMiddleware.js";
//router object
const router= express.Router();
//routing
//post route for register route 
router.post("/register",registerController)
//post route for login route 
router.post("/login",loginController)

//forgot password
router.post("/forgot-password",forgotPasswordController);

//test routes  
router.get("/test",requiredSignIn,isAdmin,testController);  // for checking if the role is of user or admin

//protected route auth
router.get("/user-auth",requiredSignIn,(req,res)=>{
    res.status(200).send({ok:true});
}); 

//protected admin route auth
router.get("/admin-auth",requiredSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
}); 

//update user profile
router.put("/profile",requiredSignIn,updateProfileController);

//user orders page 
router.get('/orders',requiredSignIn,getOrdersController);

//get all orders admin side
router.get("/all-orders",requiredSignIn,isAdmin,getAllOrdersController);

//for updating the order status admins side 
router.put("/order-status/:orderId",requiredSignIn,isAdmin,orderStatusController);

export default router;