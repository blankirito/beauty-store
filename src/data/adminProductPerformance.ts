export type AdminProductPerformance = {
  unitsSold: number;
  revenue: number;
  changePercent: number;
};

export const productPerformanceById: Record<
  number,
  AdminProductPerformance
> = {
  1: {
    unitsSold: 198,
    revenue: 17622,
    changePercent: 15,
  },
  2: {
    unitsSold: 156,
    revenue: 7020,
    changePercent: 12,
  },
  3: {
    unitsSold: 128,
    revenue: 23680,
    changePercent: 18,
  },
  4: {
    unitsSold: 116,
    revenue: 4524,
    changePercent: 8,
  },
  5: {
    unitsSold: 104,
    revenue: 6136,
    changePercent: 10,
  },
  6: {
    unitsSold: 93,
    revenue: 6975,
    changePercent: 14,
  },
  7: {
    unitsSold: 204,
    revenue: 5916,
    changePercent: 22,
  },
  8: {
    unitsSold: 142,
    revenue: 9230,
    changePercent: 11,
  },
  9: {
    unitsSold: 130,
    revenue: 5460,
    changePercent: 7,
  },
  10: {
    unitsSold: 118,
    revenue: 5782,
    changePercent: 9,
  },
  11: {
    unitsSold: 86,
    revenue: 8170,
    changePercent: 6,
  },
  12: {
    unitsSold: 112,
    revenue: 6160,
    changePercent: 13,
  },
};

const fallbackProductPerformance: AdminProductPerformance = {
  unitsSold: 0,
  revenue: 0,
  changePercent: 0,
};

export function getProductPerformance(
  productId: number,
): AdminProductPerformance {
  return productPerformanceById[productId] ?? fallbackProductPerformance;
}