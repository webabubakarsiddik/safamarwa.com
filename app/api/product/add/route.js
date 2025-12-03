import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Cloudinary Config (এটি ঠিক আছে, পরিবেশে থাকতে হবে)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
    try {
    
        await connectDB(); 
        
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
        }

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized: Seller access required'}, { status: 403 }); // 403 ব্যবহার করা হলো
        }

        const formData = await request.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const rawPrice = formData.get('price');
        const rawOfferPrice = formData.get('offerPrice');
        const files = formData.getAll('images');

        if (!name || !description || !category || !rawPrice || !rawOfferPrice) {
            return NextResponse.json({ success: false, message: 'All fields are mandatory.' }, { status: 400 });
        }
        

        const price = Number(rawPrice);
        const offerPrice = Number(rawOfferPrice);

        if (isNaN(price) || isNaN(offerPrice) || price <= 0) {
             return NextResponse.json({ success: false, message: 'Price and Offer Price must be valid numbers.' }, { status: 400 });
        }
        
        if (offerPrice > price) {
            return NextResponse.json({ success: false, message: 'Offer price cannot be higher than regular price.' }, { status: 400 });
        }

    
        if (!files || files.length === 0 || !files[0].size) {
            return NextResponse.json({ success: false, message: 'No valid files uploaded' }, { status: 400 });
        }

        const uploadResults = await Promise.all(
            files.map(async (file) => {
                const buffer = Buffer.from(await file.arrayBuffer());

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
            })
        );

        const images = uploadResults.map((r) => r.secure_url);

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
}