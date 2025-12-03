import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    // ১. অথেন্টিকেশন চেক (যদি userId না থাকে)
    if (!userId) {
        return NextResponse.json(
            { success: false, message: "Authentication required" },
            { status: 401 }
        );
    }

    const isSeller = await authSeller(userId);

    // ২. অথরাইজেশন স্ট্যাটাস কোড পরিবর্তন
    if (!isSeller) {
        return NextResponse.json(
            { success: false, message: "Not authorized: Seller access required" },
            { status: 403 } // 401 এর পরিবর্তে 403 ব্যবহার করা হলো
        );
    }

    await connectDB();

    // ৩. সেলারের আইডি দিয়ে প্রোডাক্ট ফিল্টার করা
    const products = await Product.find({ userId: userId })
        .select('name offerPrice price category image date') // শুধুমাত্র প্রয়োজনীয় ফিল্ডগুলো লোড করা
        .sort({ date: -1 }) // নতুন প্রোডাক্টগুলো আগে দেখানো
        .limit(50); // পারফরম্যান্সের জন্য একটি লিমিট সেট করা হলো
        
    return NextResponse.json({ success: true, count: products.length, products });
    
  } catch (error) {
    console.error("Seller Products GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}