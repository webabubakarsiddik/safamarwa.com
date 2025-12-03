import connectDB from "@/config/db";
import Address from "@/models/Address";
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

        // ২. ডেটা ফেচ ও সর্টিং
        const addresses = await Address.find({ userId: userId }) // স্পষ্টতার জন্য userId: userId ব্যবহার করা হলো
            .sort({ isDefault: -1, createdAt: 1 }) // ডিফল্ট অ্যাড্রেস প্রথমে এবং তারপর পুরনো থেকে নতুন ক্রমে সাজানো হলো
            .select('-__v -updatedAt'); // অপ্রয়োজনীয় মঙ্গুজ ফিল্ডগুলো বাদ দেওয়া হলো

        return NextResponse.json({ success: true, count: addresses.length, addresses });
    } catch (error) {
        console.error("GET Address Error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}