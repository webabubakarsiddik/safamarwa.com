import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    cartItems: { type: Map, of: Number, default: {} }, // productId -> quantity
  },
  { minimize: false, timestamps: true }
);

export const User = mongoose.models.user || mongoose.model("User", userSchema);
