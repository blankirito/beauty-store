import { describe, expect, it } from "vitest";
import {
    buildAdminCustomerMetrics,
    buildAdminCustomers,
    getAdminCustomerProfileId,
    toCustomerReportingOrder,
    getCustomerRetentionMetrics,
} from "./adminCustomerReporting";

describe("buildAdminCustomers", () => {
    it("groups guest orders with the same email into one customer", () => {
        const customers = buildAdminCustomers(
            [
                {
                    customerId: null,
                    customerName: "Lee Chongyu",
                    customerEmail: "Lee@example.com",
                    customerPhone: "0123456789",
                    total: 120,
                    paymentStatus: "paid",
                    fulfillmentStatus: "delivered",
                    createdAt: "2026-09-20T10:00:00.000Z",
                    location: "Kuala Lumpur, Malaysia",
                },
                {
                    customerId: null,
                    customerName: "Lee Chongyu",
                    customerEmail: "lee@example.com",
                    customerPhone: "0123456789",
                    total: 80,
                    paymentStatus: "paid",
                    fulfillmentStatus: "processing",
                    createdAt: "2026-09-22T10:00:00.000Z",
                    location: "Kuala Lumpur, Malaysia",
                },
            ],
            new Date("2026-09-28T00:00:00.000Z"),
        );

        expect(customers).toHaveLength(1);
        expect(customers[0]).toMatchObject({
            id: "guest:lee@example.com",
            email: "lee@example.com",
            orderCount: 2,
            totalSpent: 200,
            isGuest: true,
        });
    });
    it("prioritizes New over VIP for a first-time high-value customer", () => {
        const customers = buildAdminCustomers(
            [
                {
                    customerId: "customer-1",
                    customerName: "New VIP",
                    customerEmail: "new@example.com",
                    customerPhone: "0123456789",
                    total: 1200,
                    paymentStatus: "paid",
                    fulfillmentStatus: "delivered",
                    createdAt: "2026-09-20T10:00:00.000Z",
                    location: "Kuala Lumpur, Malaysia",
                },
            ],
            new Date("2026-09-28T00:00:00.000Z"),
        );

        expect(customers[0]).toMatchObject({
            status: "New",
        });
    });
    it("maps the latest shipping address into a customer reporting order", () => {
        const order = toCustomerReportingOrder({
            customer_id: null,
            customer_name: "Lee Chongyu",
            customer_email: "lee@example.com",
            customer_phone: "0123456789",
            total: 100,
            payment_status: "paid",
            fulfillment_status: "delivered",
            created_at: "2026-09-20T10:00:00.000Z",
            order_shipping_addresses: {
                city: "Kuala Lumpur",
                country: "Malaysia",
            },
        });

        expect(order).toEqual({
            customerId: null,
            customerName: "Lee Chongyu",
            customerEmail: "lee@example.com",
            customerPhone: "0123456789",
            total: 100,
            paymentStatus: "paid",
            fulfillmentStatus: "delivered",
            createdAt: "2026-09-20T10:00:00.000Z",
            location: "Kuala Lumpur, Malaysia",
        });
    });
    it("counts customer statuses for the customer metrics cards", () => {
        const metrics = buildAdminCustomerMetrics([
            {
                id: "new",
                name: "New Customer",
                email: "new@example.com",
                phone: null,
                location: "Kuala Lumpur, Malaysia",
                orderCount: 1,
                totalSpent: 100,
                isGuest: false,
                firstOrderAt: "2026-09-20T10:00:00.000Z",
                lastOrderAt: "2026-09-20T10:00:00.000Z",
                status: "New",
            },
            {
                id: "vip",
                name: "VIP Customer",
                email: "vip@example.com",
                phone: null,
                location: "Kuala Lumpur, Malaysia",
                orderCount: 4,
                totalSpent: 1200,
                isGuest: false,
                firstOrderAt: "2026-01-01T10:00:00.000Z",
                lastOrderAt: "2026-09-10T10:00:00.000Z",
                status: "VIP",
            },
            {
                id: "active",
                name: "Active Customer",
                email: "active@example.com",
                phone: null,
                location: "Kuala Lumpur, Malaysia",
                orderCount: 2,
                totalSpent: 200,
                isGuest: true,
                firstOrderAt: "2026-05-01T10:00:00.000Z",
                lastOrderAt: "2026-09-15T10:00:00.000Z",
                status: "Active",
            },
        ]);

        expect(metrics).toEqual({
            totalCustomers: 3,
            activeCustomers: 1,
            newCustomers: 1,
            vipCustomers: 1,
        });
    });
    it("creates a stable profile id for a guest order", () => {
        expect(
            getAdminCustomerProfileId(null, " Guest@example.com "),
        ).toBe("guest:guest@example.com");

        expect(
            getAdminCustomerProfileId("customer-123", "guest@example.com"),
        ).toBe("customer-123");
    });
    it("calculates returning customers and retention rate", () => {
        expect(
            getCustomerRetentionMetrics([
                { orderCount: 1 },
                { orderCount: 2 },
                { orderCount: 4 },
            ]),
        ).toEqual({
            totalCustomers: 3,
            returningCustomers: 2,
            retentionRate: 67,
        });
    });
});