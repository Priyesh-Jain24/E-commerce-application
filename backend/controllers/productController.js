import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';


//function for add product
// controllers/productController.js
// controllers/productController.js

// backend/controllers/productController.js
// controllers/productController.js
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller,} = req.body;

    // ✅ Collect files safely from image1 - image4
    const imagesArray = [];
    const fields = ["image1", "image2", "image3", "image4"];

    fields.forEach((field) => {
      if (req.files && Array.isArray(req.files[field])) {
        imagesArray.push(...req.files[field]);
      }
    });

    // ✅ Extract FULL details from each image
    const extractedImages = imagesArray.map((img) => ({
      fieldname: img.fieldname,
      originalname: img.originalname,
      encoding: img.encoding,
      mimetype: img.mimetype,
      destination: img.destination,
      filename: img.filename,
      path: img.path,
      size: img.size,
    }));

    console.log("PRODUCT DATA:", { name, description, price, category, subCategory, sizes, bestSeller,});

    console.log("IMAGES FULL DATA:", extractedImages);

    // ✅ Enforce at least one image
    if (extractedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // ✅ Example: Save image paths to DB later
    let imagesUrl=await Promise.all(
      extractedImages.map(async (img) => {
        let result=await cloudinary.uploader.upload(img.path,{resource_type:"image"});
        return result.secure_url
      })
    );
    console.log("UPLOADED IMAGE URLS:", imagesUrl);

    const productData = { name, description, price:Number(price), category, subCategory, sizes:JSON.parse(sizes), bestSeller:bestSeller==="true"?true:false, images: imagesUrl,date:Date.now() 
    };

    const product = new productModel(productData);
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      images: extractedImages,  // 👈 sending full image data to frontend
    });



  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};


//function for list product
const listProducts = async (req, res) => {
    try {
        const products =await productModel.find({});
        res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {   
        console.error("LIST PRODUCTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Error listing products",
            error: error.message,
        });
    }   
};


//function for delete product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body; // /api/products/:id

    // 1) Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 2) Try deleting
    const deletedProduct = await productModel.findByIdAndDelete(id);

    // 3) If not found
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 4) Success
    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
      product: deletedProduct, // optional
    });
  } catch (error) {
    console.error("REMOVE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error removing product",
      error: error.message,
    });
  }
};
;


//for single product details

const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;   // ✅ FROM URL

    // 1️⃣ Check if ID exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // 2️⃣ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 3️⃣ Find product
    const product = await productModel.findById(id);

    // 4️⃣ If not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 5️⃣ Success
    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    console.error("SINGLE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching product details",
      error: error.message,
    });
  }
};


export { addProduct, listProducts, removeProduct, singleProduct };