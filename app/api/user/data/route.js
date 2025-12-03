import { User } from "@/models/User";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    // ১. অথেন্টিকেশন চেক
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    // ২. গুরুত্বপূর্ণ ফিক্স: findById এর পরিবর্তে findOne ব্যবহার করা হলো
    const user = await User.findOne({ userId: userId })
        .select('-password -__v'); // ৩. পারফরম্যান্স ও নিরাপত্তার জন্য অপ্রয়োজনীয় ফিল্ড বাদ দেওয়া হলো

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Not Found in Database" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("GET User Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}