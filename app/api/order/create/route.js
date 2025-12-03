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
    
    
    if (!userId) {
        return NextResponse.json(
            { success: false, message: "Authentication required" },
            { status: 401 }
        );
    }

    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid data: Address and items are required" },
        { status: 400 } 
      );
    }

    // calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      
      amount += product.offerPrice * Number(item.quantity); 
    }

    const totalAmount = amount + Math.floor(amount * 0.02);

    
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

    const user = await User.findOne({ userId: userId }); 

    if (user) {
        user.cartItems = [];
        await user.save();
    }
    

    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("Order POST Error:", error);
    return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
    );
  }
}