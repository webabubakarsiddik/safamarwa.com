import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import { User } from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    // calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      amount += product.offerPrice * item.quantity;
    }

    const totalAmount = amount + Math.floor(amount * 0.02);

    // Send to Inngest
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: totalAmount,
        date: Date.now(),
      },
    });

    // Clear cart
    const user = await User.findById(userId);
    user.cartItems = [];
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
