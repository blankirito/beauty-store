"use server";

import { revalidatePath } from "next/cache";
import {
    getAdminStoreId,
    type StoreMembershipRole,
} from "@/lib/products/adminStore";
import {
    prepareNewProduct,
    type NewProductFormValues,
} from "@/lib/products/newProduct";
import { createClient } from "@/lib/supabase/server";

type CreateProductResult =
    | { error: string }
    | { productId: string; storeId: string };

export async function createProduct(
    values: NewProductFormValues,
): Promise<CreateProductResult> {
    const preparedProduct = prepareNewProduct(values);

    if ("error" in preparedProduct && preparedProduct.error) {
        return {
            error: preparedProduct.error,
        };
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Your session has ended. Please log in again.",
        };
    }

    const { data: memberships, error: membershipError } = await supabase
        .from("store_members")
        .select("store_id, role")
        .eq("user_id", user.id)
        .in("role", ["owner", "admin"])
        .order("created_at", { ascending: true });

    if (membershipError) {
        return {
            error: "We could not confirm your store access.",
        };
    }

    const storeId = getAdminStoreId(
        (memberships ?? []).map((membership) => ({
            storeId: membership.store_id,
            role: membership.role as StoreMembershipRole,
        })),
    );

    if (!storeId) {
        return {
            error: "You do not have permission to add products to a store.",
        };
    }

    const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
            ...preparedProduct.data,
            store_id: storeId,
        })
        .select("id")
        .single();

    if (productError) {
        if (productError.code === "23505") {
            return {
                error: "A product with this SKU or product name already exists.",
            };
        }

        return {
            error: "We could not add this product. Please try again.",
        };
    }

    revalidatePath("/admin/products");

    return {
        productId: product.id,
        storeId,
    };
}