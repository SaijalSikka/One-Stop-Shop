import express from "express";
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductContoller, productCategoryController, productFilterController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();

//routes

//for creating a product
router.post('/create-product',requiredSignIn,isAdmin,formidable(),createProductController);

//for getting all the products
router.get('/get-product',getProductController)

//for getting a single product
router.get('/get-product/:slug',getSingleProductContoller)

// for getting product photo on the basis of id 
router.get('/product-photo/:pid',productPhotoController);

//for deleting a product
router.delete('/delete-product/:pid',deleteProductController);

//for updating a product
router.put('/update-product/:pid',requiredSignIn,isAdmin,formidable(),updateProductController);

//filter product
router.post("/product-filters",productFilterController);

//for searching products
router.get("/search/:keyword",searchProductController);

//for similar products 
router.get('/related-product/:pid/:cid',relatedProductController);

//for getting category wise product details
router.get('/product-category/:slug',productCategoryController);

//payment routes:
//token
router.get("/braintree/token",braintreeTokenController);

//payment 
router.post("/braintree/payment",requiredSignIn,brainTreePaymentController);
export default router;