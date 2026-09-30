type StoreProfileUpdateInput = {
    name: string;
    slug: string;
    description: string;
};

type StoreProfileUpdate = {
    name: string;
    slug: string;
    description: string | null;
};

export function prepareStoreProfileUpdate(
    input: StoreProfileUpdateInput,
): StoreProfileUpdate {
    const name = input.name.trim();
    const slug = input.slug.trim().toLowerCase();
    const description = input.description.trim();

    if (!name) {
        throw new Error("Enter your store name.");
    }

    if (name.length > 120) {
        throw new Error("Store name must be 120 characters or less.");
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error("Enter a valid store URL.");
    }

    if (slug.length > 80) {
        throw new Error("Store URL must be 80 characters or less.");
    }

    if (description.length > 500) {
        throw new Error(
            "Store description must be 500 characters or less.",
        );
    }

    return {
        name,
        slug,
        description: description || null,
    };
}

type StoreProfileSaveErrorInput = {
    code?: string | null;
    message?: string | null;
};

export function getStoreProfileSaveError(
    error: StoreProfileSaveErrorInput,
) {
    if (error.code === "23505") {
        return "That store URL is already in use.";
    }

    return "We could not save your store profile. Please try again.";
}