"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Search,
  ShoppingBag,
  X,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center h-16 px-6 bg-surface shadow-sm">

        {/* Left */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              md:hidden
              p-2
              rounded-full
              text-on-surface-variant
              hover:bg-surface-low
            "
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link
            href="/"
            className="
              text-xl
              font-display
              font-medium
              text-primary
            "
          >
            Boutique
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex gap-8 ml-10">

            <Link
              href="/"
              className="hover:text-primary"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="hover:text-primary"
            >
              Products
            </Link>

            <Link
              href="/about"
              className="hover:text-primary"
            >
              About
            </Link>

          </nav>

        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          <Link
            href="/search"
            className="
              p-2
              rounded-full
              hover:bg-surface-low
            "
          >
            <Search size={22} />
          </Link>

          <Link
            href="/cart"
            className="
              p-2
              rounded-full
              hover:bg-surface-low
            "
          >
            <ShoppingBag size={22} />
          </Link>

        </div>

      </header>

      {/* Mobile Menu */}
      {menuOpen && (

        <div
          className="
            md:hidden
            bg-surface
            border-t
            border-outline
            shadow-md
          "
        >

          <nav className="flex flex-col">

            <Link
              href="/"
              className="px-6 py-4 hover:bg-surface-low"
            >
              Home
            </Link>

            {/* Products */}
            <button
              onClick={() => setProductOpen(!productOpen)}
              className="
                flex
                justify-between
                items-center
                px-6
                py-4
                hover:bg-surface-low
              "
            >
              Products

              <ChevronDown
                size={18}
                className={`
                  transition-transform
                  ${productOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {productOpen && (

              <div className="bg-surface-low">

                <Link
                  href="/products/skincare"
                  className="block px-10 py-3"
                >
                  Skincare
                </Link>

                <Link
                  href="/products/makeup"
                  className="block px-10 py-3"
                >
                  Makeup
                </Link>

                <Link
                  href="/products/bodycare"
                  className="block px-10 py-3"
                >
                  Body Care
                </Link>

                <Link
                  href="/products/haircare"
                  className="block px-10 py-3"
                >
                  Hair Care
                </Link>

              </div>

            )}

            <Link
              href="/search"
              className="px-6 py-4 hover:bg-surface-low"
            >
              Search
            </Link>

            <Link
              href="/profile"
              className="px-6 py-4 hover:bg-surface-low"
            >
              Profile
            </Link>

            <Link
              href="/about"
              className="px-6 py-4 hover:bg-surface-low"
            >
              About
            </Link>

          </nav>

        </div>

      )}
    </>
  );
}