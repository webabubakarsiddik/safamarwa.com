import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        // ১. অথেন্টিকেশন চেক (যদি ইউজার লগইন না থাকে)
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();
        
        // ২. সুনির্দিষ্ট ইনপুট ভ্যালিডেশন
        const { street, city, state, postalCode, country, phone, isDefault } = body.address || {};

        if (!street || !city || !postalCode || !phone) {
            return NextResponse.json(
                { success: false, message: "Missing required address fields (street, city, postalCode, phone)" },
                { status: 400 }
            );
        }

        await connectDB();
        
        // ৩. এক্সপ্লিসিট ডেটা অ্যাসাইনমেন্ট (Spread operator পরিহার)
        const newAddress = await Address.create({
            userId,
            street, 
            city, 
            state, 
            postalCode, 
            country,
            phone,
            isDefault: isDefault || false, // যদি isDefault না থাকে তবে false সেট করা হলো
        });

        return NextResponse.json({
            success: true,
            message: "Address added successfully",
            newAddress
        });
    } catch (error) {
        console.error("Address POST Error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}