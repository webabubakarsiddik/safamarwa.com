"use client";
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { Menu, X, Search, User } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();


  return (
    <>
      {/* Main Navbar Container */}
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 bg-white fixed w-full top-0 z-50 transition-all">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
            <Image
            className="cursor-pointer rounded-full hover:opacity-90 transition"
            onClick={() => router.push("/")}
            src={assets.logo}
            alt="logo"
            width={48}
            height={48}
            priority
            />
        </div>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link href="/" className="hover:text-gray-900 hover:underline underline-offset-4 transition">Home</Link>
          <Link href="/all-products" className="hover:text-gray-900 hover:underline underline-offset-4 transition">Shop</Link>
          <Link href="/about" className="hover:text-gray-900 hover:underline underline-offset-4 transition">About Us</Link>
          <Link href="/contact" className="hover:text-gray-900 hover:underline underline-offset-4 transition">Contact</Link>

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="text-xs font-medium border border-gray-300 px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition duration-300"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Icon */}
            <Search className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black transition" />

            {user ? (
                <>
                    <UserButton>
                       <UserButton.MenuItems>
                          <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={()=> router.push('/')}/>
                        </UserButton.MenuItems>
                         <UserButton.MenuItems>
                          <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={()=> router.push('/all-products')}/>
                        </UserButton.MenuItems>
                        <UserButton.MenuItems>
                          <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={()=> router.push('/cart')}/>
                        </UserButton.MenuItems>
                         <UserButton.MenuItems>
                          <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=> router.push('/my-orders')}/>
                        </UserButton.MenuItems>
                    </UserButton>
                </>
            ) : (
                <button 
                    onClick={() => openSignIn()} 
                    className="flex items-center gap-2 hover:text-gray-900 transition"
                >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="hidden sm:block font-medium">Account</span>
                </button>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMenuOpen(true)} className="md:hidden p-1 text-gray-700 hover:text-black transition">
                <Menu size={26} />
            </button>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20"></div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 right-0 bottom-0 bg-white transition-transform duration-300 z-50 shadow-2xl ${menuOpen ? "translate-x-0" : "translate-x-full"} w-64`}>
        <div className="flex flex-col text-gray-700 h-full">
          
          {/* Mobile Header (Dynamic User Info) */}
          <div className="flex items-center gap-4 p-5 border-b border-gray-200 bg-gray-50">
            {user ? (
                <>
                    <UserButton>
                        <UserButton.MenuItems>
                          <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={()=> router.push('/cart')}/>
                        </UserButton.MenuItems>
                         <UserButton.MenuItems>
                          <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=> router.push('/my-orders')}/>
                        </UserButton.MenuItems>
                    </UserButton>
                    <div className="flex flex-col">
                        <p className="font-medium text-sm text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                </>
            ) : (
                <div onClick={() => { openSignIn(); setMenuOpen(false); }} className="flex items-center gap-2 cursor-pointer">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                        <User size={18} />
                    </div>
                    <p className="font-medium">Login / Register</p>
                </div>
            )}
            
            {/* Close Button */}
            <button onClick={() => setMenuOpen(false)} className="ml-auto p-1 hover:bg-gray-200 rounded-full transition">
                <X size={20} />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col p-2">
            <Link onClick={() => setMenuOpen(false)} href="/" className="px-5 py-3 rounded-lg hover:bg-gray-100 transition font-medium">Home</Link>
            <Link onClick={() => setMenuOpen(false)} href="/all-products" className="px-5 py-3 rounded-lg hover:bg-gray-100 transition font-medium">Shop</Link>
            <Link onClick={() => setMenuOpen(false)} href="/about" className="px-5 py-3 rounded-lg hover:bg-gray-100 transition font-medium">About Us</Link>
            <Link onClick={() => setMenuOpen(false)} href="/contact" className="px-5 py-3 rounded-lg hover:bg-gray-100 transition font-medium">Contact</Link>
            
            {isSeller && (
               <div className="mt-4 px-5">
                    <button onClick={() => router.push("/seller")} className="w-full text-sm border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                        Seller Dashboard
                    </button>
               </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay Backdrop */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"></div>
      )}
    </>
  );
}