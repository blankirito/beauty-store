"use client";

import { useState } from "react";
import Link from "next/link";

import {
    X,
    ChevronDown,
    ChevronRight,
} from "lucide-react";


type Props = {
    open: boolean;
    onClose: () => void;
};


export default function SideMenu({
    open,
    onClose,
}: Props) {


    const [productOpen, setProductOpen] = useState(false);


    return (
        <>

            {/* Overlay */}

            <div
                onClick={onClose}
                className={`
                    fixed
                    inset-0
                    bg-black/40
                    transition-opacity
                    duration-300
                    z-40

                    ${
                        open
                        ?
                        "opacity-100"
                        :
                        "pointer-events-none opacity-0"
                    }
                `}
            />



            {/* Drawer */}

            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    h-screen
                    w-72
                    bg-surface
                    z-50
                    shadow-xl
                    transition-transform
                    duration-300

                    ${
                        open
                        ?
                        "translate-x-0"
                        :
                        "-translate-x-full"
                    }
                `}
            >


                {/* Header */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        p-5
                        border-b
                        border-outline
                    "
                >

                    <h2
                        className="
                            font-display
                            text-2xl
                            text-primary
                        "
                    >
                        Boutique
                    </h2>


                    <button
                        onClick={onClose}
                        className="
                            text-primary
                            p-2
                            rounded-full
                            hover:bg-surface-low
                        "
                    >
                        <X size={22}/>
                    </button>


                </div>



                {/* Menu */}

                <nav
                    className="
                        p-3
                        space-y-2
                    "
                >


                    {/* Home */}

                    <Link
                        href="/"
                        className="
                            block
                            p-3
                            rounded-lg
                            hover:bg-surface-low
                        "
                    >
                        Home
                    </Link>





                    {/* Products */}

                    <button
                        onClick={() =>
                            setProductOpen(!productOpen)
                        }
                        className="
                            w-full
                            flex
                            justify-between
                            items-center
                            p-3
                            rounded-lg
                            hover:bg-surface-low
                        "
                    >

                        <span>
                            Products
                        </span>


                        <ChevronDown
                            size={18}
                            className={`
                                transition-transform
                                duration-300

                                ${
                                    productOpen
                                    ?
                                    "rotate-180"
                                    :
                                    ""
                                }
                            `}
                        />

                    </button>




                    {/* Product Children */}

                    {
                        productOpen && (

                            <div
                                className="
                                    ml-5
                                    space-y-2
                                "
                            >


                                <button
                                    className="
                                        flex
                                        justify-between
                                        items-center
                                        w-full
                                        py-2
                                        text-sm
                                    "
                                >

                                    Skincare

                                    <ChevronRight size={16}/>

                                </button>



                                <button
                                    className="
                                        flex
                                        justify-between
                                        items-center
                                        w-full
                                        py-2
                                        text-sm
                                    "
                                >

                                    Makeup

                                    <ChevronRight size={16}/>

                                </button>




                                <button
                                    className="
                                        flex
                                        justify-between
                                        items-center
                                        w-full
                                        py-2
                                        text-sm
                                    "
                                >

                                    Haircare

                                    <ChevronRight size={16}/>

                                </button>


                            </div>

                        )
                    }
                    
                    {/* Profile */}

                    <Link
                        href="/profile"
                        className="
                            block
                            p-3
                            rounded-lg
                            hover:bg-surface-low
                        "
                    >
                        Profile
                    </Link>



                </nav>



            </aside>


        </>
    );
}