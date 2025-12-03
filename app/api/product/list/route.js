import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) { 
  try {
    await connectDB();

    const products = await Product.find({})
      .select('name offerPrice price category image date')
      .sort({ date: -1 })
      .limit(20);

    return NextResponse.json({ success: true, count: products.length, products });

  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products. " + error.message },
      { status: 500 }
    );
  }
}