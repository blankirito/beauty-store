import {
    toDatabaseProductStatus,
    type ProductStatusLabel,
} from "./productStatus";

export type NewProductFormValues = {
    name: string;
    sku: string;
    category: string;
    description: string;
    price: string;
    stock: string;
    lowStockThreshold: string;
    collection: string;
    dimensions: string;
    weight: string;
    status: ProductStatusLabel;
};

function emptyStringToNull(value: string) {
    const trimmedValue = value.trim();

    return trimmedValue === "" ? null : trimmedValue;
}

function createSlug(name: string) {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export function prepareNewProduct(
    values: NewProductFormValues,
) {
    const name = values.name.trim();
    const sku = values.sku.trim();

    if (!name || !sku) {
        return {
            error: "Product name and SKU are required.",
        };
    }

    const price = Number(values.price);
    const stock = Number(values.stock);
    const lowStockThreshold = Number(values.lowStockThreshold);

    const hasInvalidInventoryValue =
        values.price.trim() === "" ||
        values.stock.trim() === "" ||
        values.lowStockThreshold.trim() === "" ||
        !Number.isFinite(price) ||
        !Number.isFinite(stock) ||
        !Number.isFinite(lowStockThreshold) ||
        price < 0 ||
        stock < 0 ||
        lowStockThreshold < 0;

    if (hasInvalidInventoryValue) {
        return {
            error: "Price, stock, and alert level must be valid values.",
        };
    }

    const status = toDatabaseProductStatus(values.status);

    return {
        data: {
            sku,
            name,
            slug: createSlug(name),
            category: values.category.trim(),
            description: values.description.trim(),
            price,
            stock,
            low_stock_threshold: lowStockThreshold,
            status,
            is_active: status === "active",
            is_new: false,
            features: [],
            rating: 0,
            review_count: 0,
            collection: emptyStringToNull(values.collection),
            dimensions: emptyStringToNull(values.dimensions),
            weight: emptyStringToNull(values.weight),
        },
    };
}