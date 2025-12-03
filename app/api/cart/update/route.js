import connectDB from "@/config/db";
import { User } from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const { cartData } = await request.json();

        if (!cartData || typeof cartData !== "object") {
            return NextResponse.json(
                { success: false, message: "Invalid cart data" },
                { status: 400 }
            );
        }

        await connectDB();
        const result = await User.updateOne(
            { userId: userId }, 
            { $set: { cartItems: cartData } }
        );
        
        
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: "User not found in database" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}