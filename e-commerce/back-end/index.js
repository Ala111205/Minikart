require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const app=express();
// const port=process.env.PORT || 5000;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost:")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

//MongoDB connection
mongoose.connect("mongodb://localhost:27017/my_shop")
.then(()=>{
    console.log("MongoDB Connected...")
})
.catch((error)=>{
    console.log(error)
})

//Routes
const productRoutes=require("./routes/productroutes")
app.use("/api/products", productRoutes);

const adminRoutes=require("./routes/adminRoutes")
app.use("/api/admin", adminRoutes);

const orderRoutes=require("./routes/OrderRoutes");
app.use("/api/orders", orderRoutes);

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));