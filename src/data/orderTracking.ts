export const trackingSteps = [
    {
        title:"Order Placed",
        date:"Oct 20, 2026 - 09:45 AM",
        status:"completed",
    },
    {
        title:"Processing",
        date:"Oct 21, 2026 - 02:15 PM",
        status:"completed",
    },
    {
        title:"In Transit",
        date:"Oct 22, 2026 - 08:30 AM",
        status:"current",
        courier:"Elite Logistics",
        tracking:"EL-9920-112",
        description:
        "Package arrived at local sorting facility.",
    },
    {
        title:"Delivered",
        date:"Pending",
        status:"pending",
    }
] as const;