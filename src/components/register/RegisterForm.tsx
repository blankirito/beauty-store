"use client";
import {
    User,
    Mail,
    Phone,
    Lock,
    LockKeyhole,
} from "lucide-react";

import AuthInput from "../auth/AuthInput";
import AuthButton from "../auth/AuthButton";

export default function RegisterForm() {
    return (
        <form className="
            flex
            flex-col
            gap-6
        ">
            <AuthInput
                label="Full Name"
                placeholder="Alex Morgan"
                icon={User}
            />
            <AuthInput
                label="Email Address"
                placeholder="alex@gmail.com"
                icon={Mail}
            />
            <AuthInput
                label="Phone Number"
                placeholder="+60 12-345 6789"
                icon={Phone}
            />
            <AuthInput
                label="Password"
                placeholder="······"
                icon={Lock}
                type="password"
            />
            <AuthInput
                label="COnfirm Password"
                placeholder="······"
                icon={LockKeyhole}
                type="password"
            />

            <AuthButton
                type="submit"
            >
                Register
            </AuthButton>
        </form>
    )
}