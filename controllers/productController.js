import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from 'fs';
import dotenv from "dotenv";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController=async(req,res)=>{
    try{
        const {name,description,price,category,quantity}=req.fields;
        const {photo}=req.files;

        //validation
        switch(true){
            case !name:
                return res.send({
                    message:"Name is required"});
            case !description:
                return res.send({
                  message:"Description is required"});
                                     case !price:
                return res.send({
                message:"Price is required"});
            case !category:
                return res.send({
                message:"Category is required"});
            case !quantity:
                return res.send({
                message:"Quantity is required"});
            case !photo && photo.size>1000000:
                return res.send({
                    message:"photo is required and should be less than 1mb"
                });
        }
        const products=productModel({...req.fields,slug:slugify(name)});
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product Created Successfully",
            products
        })
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            message:"Error in creating product"
        })
    }
};

//controller for getting all products
export const getProductController=async(req,res)=>{
    try{
        const products=await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            TotalCount:products.length,
            message:"All Products",
            products
        })
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            message:"Error in getting all the products"
        })
    }
};

//for getting single product
export const getSingleProductContoller=async(req,res)=>{
    try{
        const product=await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        res.status(200).send({
            success:true,
            message:"Single product fetched",
            product
        })
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            message:"Error in getting a single Product",
            error
        })
    }
};

//controller for getting photo
export const productPhotoController = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.pid).select("photo");
      if (product.photo.data) {
        res.set("Content-type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erorr while getting photo",
        error,
      });
    }
  };

//controller for deleting a product
export const deleteProductController=async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success:true,
            message:"Successfully deleted a product"
        });
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            message:"Error in deleting a product",
            error
        })
    }
};

//Controller for updating a product
export const updateProductController=async(req,res)=>{
    try{
        const {name,description,price,category,quantity}=req.fields;
        const {photo}=req.files;

        //validation
        switch(true){
            case !name:
                return res.send({
                    message:"Name is required"});
            case !description:
                return res.send({
                  message:"Description is required"});
                                     case !price:
                return res.send({
                message:"Price is required"});
            case !category:
                return res.send({
                message:"Category is required"});
            case !quantity:
                return res.send({
                message:"Quantity is required"});
            case photo  && photo.size>1000000:
                return res.send({
                    message:"photo is required and should be less than 1mb"
                });
        }
        const products=await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product Updated Successfully",
            products
        })
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            message:"Error in updating product"
        })
    }
};


//controller for filters
export const productFilterController=async(req,res)=>{
    try{
        const {checked,radio}=req.body;
        let args={};
        if (checked.length >0) args.category=checked;
        if(radio.length) args.price={$gte:radio[0],$lte:radio[1]};
        const products=await productModel.find(args);
        res.status(200).send({
            success:true,
            products
        });
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            message:"Error while Filtering Products",
            error
        })
    }
};

//search product controller
export const searchProductController=async(req,res)=>{
    try{
        const {keyword}=req.params;
        const results=await productModel.find({
            $or:[
                {name:{$regex:keyword,$options:"i"}},{description:{$regex:keyword, $options:"i"}}
            ]
        }).select("-photo");
        res.json(results);
    }catch(error){
        console.log(error);
        res.send({
            success:true,
            message:"Error in search product API",
            error
        })
    }
};

//controller for similar product functionality
export const relatedProductController=async(req,res)=>{
    try{
        const {pid,cid}=req.params;
        const products= await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select("-photo").limit(3).populate("category");
        res.status(200).send({
            success:true,
            products
        })

    }catch(error){
        console.log(error);
        res.send({
            success:false,
            message:"Error while getting related products",
            error
        })
    }
};

//controller for getting details of a single category
export const productCategoryController=async(req,res)=>{
    try{
        const category=await categoryModel.findOne({slug:req.params.slug});
        const products=await productModel.find({category}).populate('category');
        res.status(200).send({
            success:true,
            category,
            products
        });
    }catch(error){
        console.log(error);
        res.send({
            success:false,
            message:"Error while getting product .",
            error
        })
    }

};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
    try {
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.send(err);
        } else {
          res.send(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  
//payment
export const brainTreePaymentController = async (req, res) => {
    try {
      const { nonce, cart } = req.body;
      let total = 0;
      cart.map((i) => {
        total += i.price;
      });
      let newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (error, result) {
          if (result) {
            const order = new orderModel({
              products: cart,
              payment: result,
              buyer: req.user._id,
            }).save();
            res.json({ ok: true });
          } else {
            res.send(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

