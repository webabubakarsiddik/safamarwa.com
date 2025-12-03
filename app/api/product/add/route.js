import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to convert stream to buffer for Cloudinary
const streamToBuffer = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
    });


// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};


export async function POST(request) {
    try {
    
        
        const { userId } = getAuth(request);

        // ১. অথেন্টিকেশন চেক
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
        }

        // ২. অথরাইজেশন চেক
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized: Seller access required'}, { status: 403 }); 
        }

        // ৩. DB কানেকশন (চেকের পরে)
        await connectDB(); 

        const formData = await request.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const rawPrice = formData.get('price');
        const rawOfferPrice = formData.get('offerPrice');
        const files = formData.getAll('images'); // এটি File objects/nullish values এর একটি অ্যারে

        
        // ৪. ইনপুট ভ্যালিডেশন
        if (!name || !description || !category || !rawPrice || !rawOfferPrice) {
            return NextResponse.json({ success: false, message: 'All text fields are mandatory.' }, { status: 400 });
        }

        const price = Number(rawPrice);
        const offerPrice = Number(rawOfferPrice);

        if (isNaN(price) || isNaN(offerPrice) || price <= 0 || offerPrice < 0) {
             return NextResponse.json({ success: false, message: 'Price must be a positive number, and Offer Price must be a non-negative number.' }, { status: 400 });
        }
        
        if (offerPrice > price) {
            return NextResponse.json({ success: false, message: 'Offer price cannot be higher than regular price.' }, { status: 400 });
        }
        
        // ৫. ফাইল ভ্যালিডেশন এবং আপলোড লজিক পরিষ্কার করা
        const validFiles = files.filter(file => file && file.size > 0);
        
        if (validFiles.length === 0) {
            return NextResponse.json({ success: false, message: 'Please upload at least one image.' }, { status: 400 });
        }

        // ৬. ক্লাউডিনারি আপলোড
        const uploadPromises = validFiles.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return uploadToCloudinary(buffer);
        });
        
        const uploadResults = await Promise.all(uploadPromises);
        
        const images = uploadResults.map((r) => r.secure_url);

        // ৭. প্রোডাক্ট তৈরি
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price, 
            offerPrice, 
            image: images,
            date: Date.now(),
        });

        return NextResponse.json({
            success: true,
            message: "Product uploaded successfully",
            newProduct
        });

    } catch (error) {
        console.error("Product upload error:", error);
        return NextResponse.json(
            { success: false, message: `Server error: ${error.message}` },
            { status: 500 }
        );
    }
};