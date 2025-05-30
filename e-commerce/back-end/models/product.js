const mongoose=require("mongoose");

//creating Schema for collection
const ProductSchema=new mongoose.Schema({
    name:{type: String},
    description:String,
    price:{type:Number},
    image:String,
    stock:{type:Number},
    brand:{type:String},
    specs:{
        ram: String,
        storage: String,
        processor: String,
        display: String,
        os: String,
        battery: String
    }
},{timestamps:true})

module.exports=mongoose.model("Product",ProductSchema)