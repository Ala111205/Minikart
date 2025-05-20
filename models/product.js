const mongoose=require("mongoose");

//creating Schema for collection
const ProductSchema=new mongoose.Schema({
    name:{type: String, required: true},
    description:String,
    price:{type:Number,required:true},
    image:String,
    stock:{type:Number,default:0},
    brand:{type:String,required:true},
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