const express=require("express");
const router=express.Router();
const Product=require("../models/product");
const verifyAdmin=require("../routes/verifyAdmin");
const cloudinary=require("../config/cloudinary");
const multer = require("multer");
const path = require("path");
const fs=require("fs");

const storage=multure.memoryStorage();
const upload=multer({storage});

const uploads = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

//POST add a new product
router.post("/shop", verifyAdmin, upload.none(), async(req,res)=>{
    try {
        console.log("BODY RECEIVED:", req.body);
        const products=new Product(req.body);
        await products.save();
        res.status(201).json(products);
    } catch (error) {
        console.log("ERROR ADDING PRODUCT:", error.message);
        res.status(500).json({ message: error.message });
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
// =========================== PUT - Update Product =============================
router.put("/shop/:id", verifyAdmin, uploads.single("image"), async (req, res) => {
  try {
    const ID = req.params.id;

    // Build updateFields from body
    const updateFields = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      brand: req.body.brand,
      image: req.body.image,
      specs: {
        ram: req.body.ram,
        storage: req.body.storage,
        processor: req.body.processor,
        display: req.body.display,
        os: req.body.os,
        battery: req.body.battery,
      },
    };

    // If new image is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateFields.image = result.secure_url;

      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(ID, updateFields, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.log("Update failed:", error.message);
    res.status(500).json({ message: error.message });
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
router.post("/upload", uploads.single("image"), async (req, res) => {
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