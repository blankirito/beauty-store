"use client";

import { useState } from "react";

import QuantitySelector from "./QuantitySelector";
import BottomActionBar from "./BottomActionBar";

type Props = {
    id: number,
};

export default function ProductClient({
    id,
}: Props) {

    const [quantity, setQuantity] = useState(1);

    return (
        <>
            <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
            />

            <BottomActionBar
                id={id}
                quantity={quantity}
            />
        </>
    )
}