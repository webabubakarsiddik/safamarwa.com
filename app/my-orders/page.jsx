'use client'
import React, { useEffect, useState, useCallback } from "react";
// import { assets } from "@/assets/assets"; // MOCKED
// import { useAppContext } from "@/context/AppContext"; // MOCKED
// import axios from "axios"; // MOCKED
// import toast from "react-hot-toast"; // MOCKED
// import Navbar from "@/components/Navbar"; // MOCKED
// import Footer from "@/components/Footer"; // MOCKED
// import Loading from "@/components/Loading"; // MOCKED
// import Image from "next/image"; // MOCKED

// --- START: Mock Dependencies for Single-File Execution ---
const toast = {
    success: (message) => console.log(`[TOAST SUCCESS]: ${message}`),
    error: (message) => console.error(`[TOAST ERROR]: ${message}`),
};
const assets = { box_icon: 'https://placehold.co/64x64/2563eb/white?text=Box' };
const Loading = () => <div className="text-center p-8"><div className="animate-spin inline-block w-6 h-6 border-4 border-t-transparent border-indigo-500 rounded-full"></div><p className="mt-2 text-gray-500">Loading...</p></div>;
const Navbar = () => <header className="bg-white shadow p-4 text-center text-xl font-bold text-gray-800">Mock Navbar</header>;
const Footer = () => <footer className="bg-gray-800 text-white p-4 text-center text-sm">Mock Footer</footer>;
const Image = ({ src, alt, className }) => <img src={src} alt={alt} className={className} onError={(e) => e.target.src = 'https://placehold.co/64x64/9ca3af/ffffff?text=X'} />;

// Mock Order Data
const mockOrders = [
    {
        _id: 'ord_101',
        amount: 45.99,
        date: new Date(Date.now() - 86400000).toISOString(),
        items: [
            { product: { name: 'Gourmet Coffee', offerPrice: 20.00, image: 'url1' }, quantity: 1 },
            { product: { name: 'Ceramic Mug', offerPrice: 10.99, image: 'url2' }, quantity: 2 },
        ],
        address: { fullName: 'Jane Doe', street: '123 Main St', city: 'Dhaka', state: 'Dhaka', postalCode: '1212', phone: '01700000001' }
    },
    {
        _id: 'ord_102',
        amount: 15.50,
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        items: [
            { product: { name: 'Artisan Bread', offerPrice: 15.50, image: 'url3' }, quantity: 1 },
        ],
        address: { fullName: 'John Smith', street: '456 Side Rd', city: 'Chittagong', state: 'Chittagong', postalCode: '4000', phone: '01800000002' }
    }
];

// Mock axios implementation
const axios = {
    get: async (url, config) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const token = config.headers.Authorization.split(' ')[1];
        if (url === '/api/order/list' && token === 'mock-auth-token') {
            return { data: { success: true, orders: mockOrders } };
        } else {
            return { data: { success: false, message: "Invalid token or server error." } };
        }
    }
};

// Mock App Context
const mockAppContext = {
    currency: '৳',
    user: { id: 'mock_user_123' },
    getToken: async () => 'mock-auth-token',
};
// --- END: Mock Dependencies ---


const MyOrders = () => {

    const { currency, getToken, user } = mockAppContext; // Using mock context

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("Authentication token missing.");

            const { data } = await axios.get('/api/order/list', { headers: { Authorization: `Bearer ${token}` } });

            if (data.success) {
                // ১. ফিক্স: সার্ভার থেকে সর্টেড ডেটা আসায় .reverse() বাদ দেওয়া হলো।
                setOrders(data.orders);
            } else {
                toast.error(data.message || 'Failed to retrieve orders.');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while fetching orders.');
        } finally {
            // এরর হলেও লোডিং বন্ধ করতে হবে
            setLoading(false); 
        }
    }, [getToken]);

    useEffect(() => {
        // Run fetchOrders only when user object is available (authenticated)
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
            toast.error("User not authenticated. Cannot fetch orders.");
        }
    }, [user, fetchOrders]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-10 min-h-screen bg-gray-50">
                <div className="space-y-8 w-full">
                    <h2 className="text-3xl font-extrabold text-gray-800 border-b pb-2">My Orders History</h2>
                    
                    {loading ? <Loading /> : (
                        orders.length === 0 ? (
                            <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                                <p className="text-xl text-gray-500">You have no orders yet.</p>
                                <button 
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                    onClick={() => toast.success("Redirecting to shop...")}
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="max-w-5xl border-t border-gray-300 text-sm bg-white rounded-xl shadow-lg">
                                {orders.map((order, index) => (
                                    <div 
                                        key={index} 
                                        className="flex flex-col lg:flex-row gap-5 justify-between p-5 border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition duration-150"
                                    >
                                        {/* Product Details */}
                                        <div className="flex-1 flex gap-5 items-center">
                                            <Image
                                                className="max-w-16 max-h-16 object-cover rounded-md"
                                                src={assets.box_icon}
                                                alt="box_icon"
                                            />
                                            <p className="flex flex-col gap-1">
                                                <span className="font-semibold text-base text-gray-900">
                                                    {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
                                                </span>
                                                <span className="text-gray-600">Items: {order.items.length}</span>
                                            </p>
                                        </div>

                                        {/* Address Details */}
                                        <div className="text-gray-600 w-full lg:w-1/4">
                                            <p>
                                                <span className="font-medium text-gray-800">{order.address.fullName}</span>
                                                <br />
                                                {/* ২. ফিক্স: 'area' এর পরিবর্তে 'street' বা 'postalCode' ব্যবহার করা হলো */}
                                                <span >{order.address.street || order.address.postalCode}</span> 
                                                <br />
                                                <span>{`${order.address.city}, ${order.address.state}`}</span>
                                                <br />
                                                {/* ৩. ফিক্স: 'phoneNumber' এর পরিবর্তে 'phone' ব্যবহার করা হলো */}
                                                <span>Phone: {order.address.phone}</span> 
                                            </p>
                                        </div>

                                        {/* Amount and Status */}
                                        <div className="flex flex-col justify-center items-end text-right">
                                            <p className="text-xl font-bold text-green-600">{currency}{order.amount.toFixed(2)}</p>
                                            <p className="flex flex-col text-xs mt-2 text-gray-500">
                                                <span className="font-medium">Method: COD</span>
                                                <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                                                <span className="font-bold text-red-500">Payment: Pending</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;