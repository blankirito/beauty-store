import {
    getSafeAuthCallbackNext,
    getSafeAuthCallbackStoreSlug,
} from "@/lib/auth/authCallback";
import { getSignInDestination } from "@/lib/auth/getSignInDestination";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getLoginFailureRedirect(request: Request) {
    return NextResponse.redirect(
        new URL("/login?notice=google-sign-in-failed", request.url),
    );
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const storeSlug = getSafeAuthCallbackStoreSlug(
        requestUrl.searchParams.get("store"),
    );
    const safeNext = getSafeAuthCallbackNext(
        requestUrl.searchParams.get("next"),
    );

    if (!code) {
        return getLoginFailureRedirect(request);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
        return getLoginFailureRedirect(request);
    }

    const [{ data: profile, error: profileError }, { data: storeMembership }] =
        await Promise.all([
            supabase
                .from("profiles")
                .select("is_platform_admin")
                .eq("id", data.user.id)
                .single(),

            supabase
                .from("store_members")
                .select("id")
                .eq("user_id", data.user.id)
                .in("role", ["owner", "admin"])
                .limit(1)
                .maybeSingle(),
        ]);

    if (profileError || !profile) {
        return getLoginFailureRedirect(request);
    }

    const roleDestination = getSignInDestination(
        profile.is_platform_admin,
        Boolean(storeMembership),
        Boolean(data.user.user_metadata.merchant_intent),
        storeSlug,
    );

    const hasElevatedAccess =
        profile.is_platform_admin ||
        Boolean(storeMembership) ||
        Boolean(data.user.user_metadata.merchant_intent);

    const destination =
        !hasElevatedAccess && safeNext !== "/"
            ? safeNext
            : roleDestination;

    return NextResponse.redirect(new URL(destination, request.url));
}