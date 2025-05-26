const express=require("express");
const router=express.Router();
const Product=require("../models/product");
const verifyAdmin=require("../routes/verifyAdmin")
const multer = require("multer");
const path = require("path");

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
        const products=await Product.find();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure "uploads/" exists in project root
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST /upload route
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports=router;