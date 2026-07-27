"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  ShoppingCart,
  User,
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
                name: "Skincare",
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
                name: "Hair Care",
                href: "/products/haircare"
            },
        ]
    },
    {
        name: "Your Account",
        children: [
            {
                name: "Account",
                href: "/profile"
            },
            {
                name: "Sign In",
                href: "/login"
            },
        ]
    },
];


export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);


    return (
        <>

            <header
                className="
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
                "
            >

                {/* Left */}

                <div className="flex items-center gap-3">

                    {/* Mobile Menu Button */}

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="
                            md:hidden
                            text-primary
                        "
                    >
                        {
                            menuOpen
                            ?
                            <X size={24}/>
                            :
                            <Menu size={24}/>
                        }
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



                    {/* Desktop Menu */}

                    <nav
                        className="
                            hidden
                            md:flex
                            gap-8
                            ml-10
                        "
                    >

                        {
                            menu.map((item) => (

                                item.children

                                ?

                                <div
                                    key={item.name}
                                    className="relative"
                                >
                                    <button
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            hover:text-primary
                                        "
                                    >
                                        {item.name}

                                        <ChevronDown size={16}/>
                                    </button>
                                </div>


                                :

                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="
                                        hover:text-primary
                                    "
                                >
                                    {item.name}
                                </Link>

                            ))
                        }

                    </nav>

                </div>



                {/* Right */}

                <div
                    className="
                        flex
                        gap-2
                    "
                >

                    <Link
                        href="/cart"
                        className="
                            p-2
                            rounded-full
                            hover:bg-surface-low
                        "
                    >
                        <ShoppingCart size={22}/>
                    </Link>


                    <Link
                        href="/profile"
                        className="
                            p-2
                            rounded-full
                            hover:bg-surface-low
                        "
                    >
                        <User size={22}/>
                    </Link>

                </div>

            </header>




            {/* Mobile Menu */}

            {
                menuOpen && (

                    <div
                        className="
                            md:hidden
                            bg-surface
                            border-t
                            border-outline
                            shadow-md
                        "
                    >

                        <nav
                            className="
                                flex
                                flex-col
                            "
                        >

                            {
                                menu.map((item) => {

                                    const isOpen =
                                        openMenu === item.name;


                                    return item.children

                                    ?

                                    (

                                    <div
                                        key={item.name}
                                    >

                                        <button
                                            onClick={() =>
                                                setOpenMenu(
                                                    isOpen
                                                    ?
                                                    null
                                                    :
                                                    item.name
                                                )
                                            }
                                            className="
                                              w-full
                                              flex
                                              justify-between
                                              items-center
                                              px-6
                                              py-4
                                              rounded-lg
                                              hover:bg-surface-low
                                              active:bg-surface-low
                                              transition
                                            "
                                        >

                                            {item.name}


                                            <ChevronDown
                                                size={18}
                                                className={`
                                                    transition-transform
                                                    duration-300

                                                    ${
                                                        isOpen
                                                        ?
                                                        "rotate-180"
                                                        :
                                                        ""
                                                    }
                                                `}
                                            />

                                        </button>



                                        {
                                            isOpen && (

                                                <div
                                                    className="
                                                    "
                                                >

                                                    {
                                                        item.children.map(
                                                            (child) => (

                                                                <Link
                                                                    key={child.name}
                                                                    href={child.href}
                                                                    onClick={() => {
                                                                        setMenuOpen(false);
                                                                        setOpenMenu(null);
                                                                    }}
                                                                    className="
                                                                        block
                                                                        px-10
                                                                        py-3
                                                                        rounded-lg
                                                                        hover:bg-surface-low
                                                                        active:scale-[0.98]
                                                                        transition
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

                                    )


                                    :

                                    (

                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="
                                            px-6
                                            py-4
                                        "
                                    >
                                        {item.name}
                                    </Link>

                                    )

                                })
                            }

                        </nav>

                    </div>

                )
            }

        </>
    );
}
