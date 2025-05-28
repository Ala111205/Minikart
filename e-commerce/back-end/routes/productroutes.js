const express=require("express");
const router=express.Router();
const Product=require("../models/product");
const verifyAdmin=require("../routes/verifyAdmin");
const cloudinary=require("../config/cloudinary");
const multer = require("multer");
const path = require("path");
const fs=require("fs")

//POST add a new product
router.post("/shop", verifyAdmin, async(req,res)=>{
    try {
        const products=new Product(req.body);
        await products.save();
        res.status(201).json(products);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

// GET all products
router.get("/shop", verifyAdmin, async(req,res)=>{
    try {
        console.log("Received data: ",req.body)
        const products = await Product.find();
        res.status(201).json(products);
        
    } catch (error) {
        console.log("Error saving product:", error.message);
        res.status(500).json({ message: error.message });
    }
});

//show the product with id
router.get("/shop/:id", verifyAdmin, async(req,res)=>{
    try {
        const products=await Product.findById(req.params.id);
        if(!products) 
            return res.status(404).json({message:"Product not found"})
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
});

//PUT Update a product
router.put("/shop/:id", verifyAdmin, async(req,res)=>{
    try {
        const ID=req.params.id
        const products=await Product.findByIdAndUpdate(ID,req.body,{new:true})
        res.json(products);

        if(!products){
            return res.status(404).json({message: "Item is Not Found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
});

//DELETE a product
router.delete("/shop/:id", verifyAdmin, async(req,res)=>{
    try {
        const ID=req.params.id
        const products=await Product.findByIdAndDelete(ID)
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
});
// Store uploaded images in /uploads folder
const upload = multer({ dest: "uploads/" }); // temp local folder

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Delete the temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ imageUrl: result.secure_url }); // store this URL in DB
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

module.exports=router;