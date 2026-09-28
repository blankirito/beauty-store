import { describe, expect, it } from "vitest";
import {
    filterReportingOrdersByDate,
    getReportingCategories,
    getReportingMetrics,
    getReportingRevenue,
    getTopReportingProducts,
    toReportingOrder,
    getReportingRevenueByDay,
    getReportingOrderDistribution,
    getReportingDateRange,
} from "./adminReporting";

describe("getReportingRevenue", () => {
    it("only totals paid orders that are not cancelled", () => {
        const revenue = getReportingRevenue([
            {
                total: 100,
                paymentStatus: "paid",
                fulfillmentStatus: "delivered",
            },
            {
                total: 50,
                paymentStatus: "pending",
                fulfillmentStatus: "processing",
            },
            {
                total: 80,
                paymentStatus: "paid",
                fulfillmentStatus: "cancelled",
            },
        ]);

        expect(revenue).toBe(100);
    });
    it("returns revenue, paid order count, and average order value", () => {
        const metrics = getReportingMetrics([
            {
                total: 120,
                paymentStatus: "paid",
                fulfillmentStatus: "delivered",
            },
            {
                total: 80,
                paymentStatus: "paid",
                fulfillmentStatus: "processing",
            },
            {
                total: 50,
                paymentStatus: "failed",
                fulfillmentStatus: "new",
            },
        ]);

        expect(metrics).toEqual({
            revenue: 200,
            paidOrderCount: 2,
            averageOrderValue: 100,
        });
    });
    it("aggregates paid order items into top products", () => {
        const products = getTopReportingProducts([
            {
                total: 100,
                paymentStatus: "paid",
                fulfillmentStatus: "delivered",
                items: [
                    {
                        productId: "serum",
                        productName: "Glow Serum",
                        category: "Skincare",
                        quantity: 2,
                        lineTotal: 100,
                    },
                ],
            },
            {
                total: 40,
                paymentStatus: "paid",
                fulfillmentStatus: "processing",
                items: [
                    {
                        productId: "serum",
                        productName: "Glow Serum",
                        category: "Skincare",
                        quantity: 1,
                        lineTotal: 40,
                    },
                ],
            },
            {
                total: 80,
                paymentStatus: "paid",
                fulfillmentStatus: "cancelled",
                items: [
                    {
                        productId: "cancelled-product",
                        productName: "Cancelled Product",
                        category: "Makeup",
                        quantity: 1,
                        lineTotal: 80,
                    },
                ],
            },
        ]);

        expect(products).toEqual([
            {
                productId: "serum",
                productName: "Glow Serum",
                category: "Skincare",
                unitsSold: 3,
                revenue: 140,
            },
        ]);
    });
    it("aggregates paid order items by category", () => {
        const categories = getReportingCategories([
            {
                total: 120,
                paymentStatus: "paid",
                fulfillmentStatus: "delivered",
                items: [
                    {
                        productId: "serum",
                        productName: "Glow Serum",
                        category: "Skincare",
                        quantity: 1,
                        lineTotal: 120,
                    },
                ],
            },
            {
                total: 40,
                paymentStatus: "paid",
                fulfillmentStatus: "processing",
                items: [
                    {
                        productId: "lip",
                        productName: "Velvet Lip",
                        category: "Makeup",
                        quantity: 1,
                        lineTotal: 40,
                    },
                ],
            },
            {
                total: 70,
                paymentStatus: "paid",
                fulfillmentStatus: "cancelled",
                items: [
                    {
                        productId: "cancelled",
                        productName: "Cancelled Item",
                        category: "Skincare",
                        quantity: 1,
                        lineTotal: 70,
                    },
                ],
            },
        ]);

        expect(categories).toEqual([
            {
                category: "Skincare",
                revenue: 120,
                percentage: 75,
            },
            {
                category: "Makeup",
                revenue: 40,
                percentage: 25,
            },
        ]);
    });
    it("uses the order item category snapshot when mapping a database order", () => {
        const order = toReportingOrder({
            total: 150,
            payment_status: "paid",
            fulfillment_status: "delivered",
            order_items: [
                {
                    product_id: "serum",
                    product_name: "Glow Serum",
                    product_category: "Skincare",
                    quantity: 2,
                    line_total: 150,
                    products: {
                        category: "Beauty",
                    },
                },
            ],
        });

        expect(order).toEqual({
            total: 150,
            paymentStatus: "paid",
            fulfillmentStatus: "delivered",
            items: [
                {
                    productId: "serum",
                    productName: "Glow Serum",
                    category: "Skincare",
                    quantity: 2,
                    lineTotal: 150,
                },
            ],
        });
    });
    it("keeps orders inside a date range and excludes the end boundary", () => {
        const orders = filterReportingOrdersByDate(
            [
                {
                    total: 100,
                    paymentStatus: "paid",
                    fulfillmentStatus: "delivered",
                    createdAt: "2026-09-01T00:00:00.000Z",
                },
                {
                    total: 80,
                    paymentStatus: "paid",
                    fulfillmentStatus: "delivered",
                    createdAt: "2026-09-30T23:59:59.000Z",
                },
                {
                    total: 50,
                    paymentStatus: "paid",
                    fulfillmentStatus: "delivered",
                    createdAt: "2026-10-01T00:00:00.000Z",
                },
            ],
            {
                start: "2026-09-01T00:00:00.000Z",
                end: "2026-10-01T00:00:00.000Z",
            },
        );

        expect(orders).toHaveLength(2);
    });
    it("groups paid revenue by Malaysia calendar day", () => {
        expect(
            getReportingRevenueByDay([
                {
                    total: 120,
                    paymentStatus: "paid",
                    fulfillmentStatus: "delivered",
                    createdAt: "2026-09-22T02:00:00.000Z",
                },
                {
                    total: 80,
                    paymentStatus: "paid",
                    fulfillmentStatus: "processing",
                    createdAt: "2026-09-22T10:00:00.000Z",
                },
                {
                    total: 90,
                    paymentStatus: "failed",
                    fulfillmentStatus: "new",
                    createdAt: "2026-09-23T02:00:00.000Z",
                },
            ]),
        ).toEqual([
            {
                date: "2026-09-22",
                revenue: 200,
            },
        ]);
    });
    it("counts orders by fulfillment status", () => {
        expect(
            getReportingOrderDistribution([
                {
                    total: 100,
                    paymentStatus: "paid",
                    fulfillmentStatus: "delivered",
                },
                {
                    total: 80,
                    paymentStatus: "pending",
                    fulfillmentStatus: "processing",
                },
                {
                    total: 50,
                    paymentStatus: "paid",
                    fulfillmentStatus: "cancelled",
                },
            ]),
        ).toEqual([
            { status: "New", count: 0 },
            { status: "Processing", count: 1 },
            { status: "Shipped", count: 0 },
            { status: "Delivered", count: 1 },
            { status: "Cancelled", count: 1 },
        ]);
    });
    it("returns this month's Malaysia reporting range", () => {
        expect(
            getReportingDateRange(
                "this-month",
                new Date("2026-09-28T12:00:00.000Z"),
            ),
        ).toEqual({
            start: "2026-09-01T00:00:00.000+08:00",
            end: "2026-10-01T00:00:00.000+08:00",
        });
    });
});