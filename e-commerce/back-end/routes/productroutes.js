const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const verifyAdmin = require("../middleware/verifyAdmin"); // admin only
const verifyUser = require("../middleware/verifyUser");   // logged-in user
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const fs = require("fs");
const streamifier = require("streamifier");

// --------------------------- Multer Setup ---------------------------
// Use memory storage only for Cloudinary uploads
const upload = multer({ storage: multer.memoryStorage() });

// --------------------------- PUBLIC ROUTES ---------------------------
// Anyone can view products
router.get("/shop", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/shop/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// --------------------------- ADMIN ROUTES ---------------------------
// Only admin can add, update, delete products
router.post("/shop", verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, brand, specs, image } = req.body;

    const product = new Product({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      brand,
      image,
      specs: {
        ram: specs?.ram,
        storage: specs?.storage,
        processor: specs?.processor,
        display: specs?.display,
        os: specs?.os,
        battery: specs?.battery,
      },
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put("/shop/:id", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, brand, specs, image } = req.body;
    const ID = req.params.id;

    const updateFields = {
      name,
      description,
      price,
      stock,
      brand,
      image,
      specs,
    };

    // If new image is uploaded via file
    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result);
            else reject(error);
          });
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      updateFields.image = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(ID, updateFields, { new: true });

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update failed:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete("/shop/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(204).end();
  } catch (error) {
    console.error("Delete failed:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Upload image for product (admin only)
router.post("/upload", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Image upload failed:", error.message);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

module.exports = router;