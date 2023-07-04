import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        if(!name){
            return res.send({
                message:"Name is required."
            })
        }
        const existingCategory=await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category Already exists"
            })
        }
        const category=await new categoryModel({name,slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"New Category Created .",
            category
        })
    }catch(error){
        console.log(error);
        res.send({
            success: false,
            error,
            message:"error in category"
        });
    }
}; 

//update category Controller
export const updateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        const {id}=req.params;
        const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"Category updated successfully",
            category
        })
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            error,
            message:"Error while updating category"
        })
    }
};

//showing all the categories controller
export const categoryController=async(req,res)=>{
    try{
        const category=await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All Categories List",
            category
        })
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            error,
            message:"Error while getting all categories"
        })
    }
}; 

//for getting a single category
export const SingleCategoryController=async(req,res)=>{
    try{
        const category=await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Sucessfully got single category",
            category
        })
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            error,
            message:"Error while getting single categories"
        })
    }
}; 

//for deleting a category
export const deleteCategoryController=async(req,res)=>{
    try{
        const {id}=req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Category deleted successfully"
        })
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            error,
            message:"Error in deleting a category"
        })
    }
};