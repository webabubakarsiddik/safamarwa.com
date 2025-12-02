import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "User" }, // 'User' matches your User model
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  date: { type: Number, required: true },
});

// Check if model already exists, otherwise create it
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
