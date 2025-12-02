import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: [String], required: true }, // array of URLs
    category: { type: String, required: true },
    date: { type: Date, default: Date.now }, // store as Date
  },
  { timestamps: true }
);

const Product = mongoose.models.product || mongoose.model("Product", productSchema);

export default Product;
