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

const menu = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Product",
        children: [
            {
                name: "skincare",
                href: "/products/skincare"
            },
            {
                name: "Makeup",
                href: "/products/makeup"
            },
            {
                name: "Body Care",
                href: "/products/bodycare"
            },
            {
                name: "Hair Cair",
                href: "/products/haircare"
            },
        ]
    },
    // {
    //     name: "About",
    //     href: "/about",
    // },
    {
        name: "Profile",
        href: "/profile",
    },
    
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  return (
    <>
      <header className="
        sticky
        top-0
        z-50
        h-16
        px-6
        bg-surface
        shadow-sm
        flex
        items-center
        justify-between
      ">

        {/* Left */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              md:hidden
              text-primary
            "
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link
            href="/"
            className="
              text-xl
              font-display
              text-primary
            "
          >
            Boutique
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex gap-8 ml-10">

            {
                menu.map((item) => (
                    item.children?

                    <div 
                        key={item.name}>
                            {item.name}
                    </div>

                    :

                    <Link
                        key={item.name}
                        href={item.href}
                        className="hover:text-primary"
                    >
                        {item.name}
                    </Link>
                ))
            }

          </nav>

        </div>

        {/* Right */}
        <div className="flex gap-2">

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

          <nav className="
                flex
                flex-col
          ">
            {
                menu.map((item) => (

                    item.children?

                    <div key={item.name}>

                        <button
                            onClick={() => setProductOpen(!productOpen)

                            }
                            className="
                                w-full
                                flex
                                justify-between
                                px-6
                                py-4
                            "
                        >
                            {item.name}

                            <ChevronDown
                                size={18}
                                className={
                                    productOpen
                                    ?
                                    "rotate-180"
                                    :
                                    ""
                                }
                            />
                        </button>
                                {
                                    productOpen && (
                                        
                                        <div className="
                                            bg-surface-low
                                        ">
                                            {
                                                item.children.map(
                                                (child)=>(

                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className="
                                                        block
                                                        px-10
                                                        py-3
                                                        "
                                                    >
                                                        {child.name}
                                                    </Link>
                                                )
                                            )
                                            }
                                            
                                        </div>
                                    )
                                }
                    </div>

                    :

                    <Link 
                        key={item.name}
                        href={item.href}
                        className="
                        px-6
                        py-4
                        "
                    >
                        {item.name}
                    </Link>
                ))
            }
          </nav>

        </div>

      )}
    </>
  );
}