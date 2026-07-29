"use client";

import { useState } from "react";
import PasswordRequirement from "./PasswordRequirement";
import AuthInput from "@/components/auth/AuthInput";
import { Lock } from "lucide-react";

export default function PasswordForm() {

    const [showCurrentPassword,setShowCurrentPassword] = useState(false);

    const [showNewPassword,setShowNewPassword] = useState(false);

    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    return (
        <form className="space-y-6">
            
            <AuthInput
                label="Current Password"
                placeholder="Enter current password"
                icon={Lock}
                type="password"
                autoComplete="current-password"
            />


            <AuthInput
                label="New Password"
                placeholder="Enter new password"
                icon={Lock}
                type="password"
                autoComplete="new-password"
            />


            <AuthInput
                label="Confirm New Password"
                placeholder="Confirm new password"
                icon={Lock}
                type="password"
                autoComplete="new-password"
            />

            <PasswordRequirement />

            <button 
                type="submit"
                className="
                    w-full
                    py-4
                    rounded-lg
                    bg-primary
                    text-white
                    font-semibold
                    hover:opacity-90
                    transition
                "
            >
                Update Password
            </button>
        </form>
    )
}