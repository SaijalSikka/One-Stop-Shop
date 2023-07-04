import express from "express";
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";
import { SingleCategoryController, categoryController, createCategoryController, deleteCategoryController, updateCategoryController } from "../controllers/CategoryController.js";
const router=express.Router();

//routes

//for creating category
router.post("/create-category",requiredSignIn,isAdmin,createCategoryController)

//for updating category
router.put("/update-category/:id",requiredSignIn,isAdmin,updateCategoryController);

//for getting all the categories
router.get("/get-category",categoryController)

//for getting a single category
router.get("/single-category/:slug",SingleCategoryController);

//for deleting a category
router.delete("/delete-category/:id",requiredSignIn,isAdmin,deleteCategoryController)

export default router;