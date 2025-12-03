import connectDB from "@/config/db";
import { User } from "@/models/User";
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

        const user = await User.findOne({ userId: userId }).select('cartItems'); 
        
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found in database" },
                { status: 404 }
            );
        }

        const { cartItems } = user;
        
        return NextResponse.json({ success: true, cartItems });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}