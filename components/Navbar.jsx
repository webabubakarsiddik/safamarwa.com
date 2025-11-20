"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { Menu, X, Search, User } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSeller, router } = useAppContext();

  return (
    <>
      {/* Main Navbar Container */}
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 bg-white fixed w-full top-0 z-50">
        
        {/* Logo Section */}
        <Image
          className="w-12 sm:w-12 md:w-12 lg:w-12 cursor-pointer rounded-full"
          onClick={() => router.push("/")}
          src={assets.logo}
          alt="logo"
          width={48}
          height={48}
        />

        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-gray-900 transition">Home</Link>
          <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
          <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
          <Link href="/" className="hover:text-gray-900 transition">Contact</Link>

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="text-xs border px-4 py-1.5 rounded-full hover:bg-gray-50 transition"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-4">
            <li><Search className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black" /></li>
            <li>
              <button className="flex items-center gap-2 hover:text-gray-900 transition">
                <User className="w-5 h-5 text-gray-600" />
                Account
              </button>
            </li>
          </ul>

          <div className="flex items-center md:hidden gap-3">
            {isSeller && (
              <button onClick={() => router.push("/seller")} className="text-xs border px-4 py-1.5 rounded-full">
                Seller Dashboard
              </button>
            )}
            <button className="flex items-center gap-2 hover:text-gray-900 transition">
              <User className="w-5 h-5 text-gray-600" />
              Account
            </button>
          </div>

          <button onClick={() => setMenuOpen(true)} className="md:hidden p-1 text-gray-700">
            <Menu size={26} />
          </button>
        </div>
      </nav>

      <div className="h-20 mb-30"></div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 right-0 bottom-0 bg-white transition-all duration-300 z-50 shadow-xl overflow-hidden ${menuOpen ? "w-64" : "w-0"}`}>
        <div className="flex flex-col text-gray-700 h-full">
          <div onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50">
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
              <X size={18} />
            </div>
            <p className="font-medium">Safa Marwa</p>
          </div>
          <div className="flex flex-col mt-2">
            <Link onClick={() => setMenuOpen(false)} href="/" className="py-3 pl-6 border-b border-gray-100 hover:bg-gray-50 transition">Home</Link>
            <Link onClick={() => setMenuOpen(false)} href="/all-products" className="py-3 pl-6 border-b border-gray-100 hover:bg-gray-50 transition">Shop</Link>
            <Link onClick={() => setMenuOpen(false)} href="/" className="py-3 pl-6 border-b border-gray-100 hover:bg-gray-50 transition">About Us</Link>
            <Link onClick={() => setMenuOpen(false)} href="/" className="py-3 pl-6 border-b border-gray-100 hover:bg-gray-50 transition">Contact</Link>
          </div>
        </div>
      </div>
      
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/20 z-40 md:hidden"></div>
      )}
    </>
  );
}