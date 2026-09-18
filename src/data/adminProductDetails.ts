export type AdminProductDetail = {
  lowStockThreshold: number;
  collection: string;
  dimensions: string;
  weight: string;
  createdAt: string;
  updatedAt: string;
  performance: {
    unitsSold: number;
    orders: number;
    revenue: number;
  };
};

export const adminProductDetailsById: Record<number, AdminProductDetail> = {
  1: {
    lowStockThreshold: 15,
    collection: "Radiance Essentials",
    dimensions: "30 ml bottle",
    weight: "120 g",
    createdAt: "Aug 14, 2025",
    updatedAt: "Oct 22, 2025",
    performance: {
      unitsSold: 198,
      orders: 164,
      revenue: 17622,
    },
  },
  2: {
    lowStockThreshold: 12,
    collection: "Radiance Essentials",
    dimensions: "30 ml bottle",
    weight: "120 g",
    createdAt: "Aug 20, 2025",
    updatedAt: "Oct 20, 2025",
    performance: {
      unitsSold: 156,
      orders: 141,
      revenue: 7020,
    },
  },
  3: {
    lowStockThreshold: 10,
    collection: "Hydration Ritual",
    dimensions: "50 ml jar",
    weight: "180 g",
    createdAt: "Sep 2, 2025",
    updatedAt: "Oct 21, 2025",
    performance: {
      unitsSold: 128,
      orders: 116,
      revenue: 23680,
    },
  },
};

const fallbackProductDetail: AdminProductDetail = {
  lowStockThreshold: 10,
  collection: "Lumina Essentials",
  dimensions: "Standard size",
  weight: "150 g",
  createdAt: "Sep 1, 2025",
  updatedAt: "Oct 22, 2025",
  performance: {
    unitsSold: 84,
    orders: 72,
    revenue: 4200,
  },
};

export function getAdminProductDetail(productId: number): AdminProductDetail {
  return adminProductDetailsById[productId] ?? fallbackProductDetail;
}