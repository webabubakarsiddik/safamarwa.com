import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";


export async function GET(request) {
    try {
        const {userId} = getAuth(request)

        await connectDB()

        Address.length
        Product.length

        const orders = await Order.find({userId}).populate('address items.product')

        return NextRequest.json({ success:true, orders})
    } catch (error) {
        return NextRequest.json({ success:false, message:error.message})
    }
}