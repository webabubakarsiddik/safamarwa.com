import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // use String instead of Number
    pincode: { type: String, required: true },     // use String instead of Number
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Address = mongoose.models.address || mongoose.model("address", addressSchema);

export default Address;
