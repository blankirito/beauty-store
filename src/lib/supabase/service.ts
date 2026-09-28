import "server-only";

import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!secretKey) {
        throw new Error("The secure checkout service is not configured.");
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secretKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        },
    );
}