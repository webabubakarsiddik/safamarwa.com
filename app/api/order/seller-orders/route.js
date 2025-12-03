import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import Product from "@/models/Product"; 
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB(); 
        
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }
        
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json(
                { success: false, message: 'Not authorized: Seller access required' },
                { status: 403 }
            );
        }
        

        const sellerProducts = await Product.find({ userId }).select('_id');
        const productIds = sellerProducts.map(p => p._id);

        if (productIds.length === 0) {
            return NextResponse.json({ success: true, orders: [], message: "No products found for this seller." });
        }

        const orders = await Order.find({
            'items.product': { $in: productIds } 
        })
            .sort({ date: -1 }) 
            .populate("address")
            .populate("items.product");

        return NextResponse.json({ success: true, count: orders.length, orders });

    } catch (error) {
        console.error("GET Seller Orders Error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}