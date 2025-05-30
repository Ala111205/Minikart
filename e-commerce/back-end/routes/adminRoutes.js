const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const Admin=require("../models/Admin");
const router=express.Router();


//Forgot Password route
router.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not registered' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//Register route for admin creation
router.post("/register",async(req,res)=>{
    const {firstname,lastname,email,password}=req.body;

    // Check if all required fields are provided
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Received values:");
    console.log("Type of password:", typeof password); // Should be 'string'
    console.log("Password value:", password);

    try {
        console.log(req.body)
        const existingAdmin = await Admin.findOne({ firstname,lastname,email,password });
        if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
        }

        if (typeof password !== "string") {
            return res.status(400).json({ message: "Invalid password format" });
        }
        
        const saltRounds=10
        const hashedPassword = await bcrypt.hash(password, saltRounds); // hash the password
        const admin = new Admin({firstname, lastname, email, password: hashedPassword });
        await admin.save(); // save to MongoDB

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error'+error.message });
    }
})

//Admin Login
router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const admin=await Admin.findOne({email});
        if(!admin) return res.status(400).json({message: "Invalid credentials"});

        const isMatch=await bcrypt.compare(password,admin.password);
        if(!isMatch) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign({ adminId: admin._id }, "process.env.JWT_SECRET", { expiresIn: "1d" });
        res.status(200).json({
            token,
            admin:{
                name:admin.firstname+admin.lastname,
                email:admin.email,
                _id:admin._id
            }
        });
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

module.exports=router;
