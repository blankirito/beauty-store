import {
    ReceiptText,
    CreditCard,
    Truck,
    RotateCcw,
    UserRound,
} from "lucide-react";

export const categories = [
    {
        title: "Orders",
        description: "Track, modify or cancel",
        icon: ReceiptText,
    },
    {
        title: "Payment",
        description: "Methods & billing",
        icon: CreditCard,
    },
    {
        title: "Shipping",
        description: "Rates & delivery times",
        icon: Truck,
    },
    {
        title: "Returns",
        description: "Policy & exchanges",
        icon: RotateCcw,
    },
    {
        title: "Account",
        description: "Profile & preferences",
        icon: UserRound,
    },
] as const;