require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const app=express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:2999",
    "https://minikart-pearl.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

//MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

//Routes
const productRoutes=require("./routes/productroutes")
app.use("/api/products", productRoutes);

const authRoutes=require("./routes/authRoutes")
app.use("/api/admin", authRoutes);

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