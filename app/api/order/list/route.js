import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({ userId })
      .sort({ date: -1 })
      .populate({ path: "address", select: "-__v" })
      .populate({
        path: "items.product",
        select: "name offerPrice image"
      });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET Orders Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders. " + error.message,
      },
      { status: 500 }
    );
  }
}
