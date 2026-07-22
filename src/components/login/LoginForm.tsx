"use client";

import { Mail, Lock } from "lucide-react";
import AuthInput from "../auth/AuthInput";
import AuthButton from "../auth/AuthButton"; 
import {
    useState
} from "react";

export default function LoginForm() {
    
    const [loading, setLoading] = useState(false);

    return (
        <form className="
            flex
            flex-col
            gap-5
        ">
            <div>
                <AuthInput
                    label="Email or Phone"
                    placeholder="alex@gmail.com"
                    icon={Mail}
                />
            </div>

            <div>
                <div className="relative">
                    <AuthInput
                        label="Password"
                        placeholder="······"
                        icon={Lock}
                        type="password"
                    />
                </div>

                <div className="
                    text-right
                    mt-2
                ">
                    <span className="
                        text-primary
                        text-sm
                        cursor-pointer
                    ">Forgot Password?</span>
                </div>
            </div>
{/* 
            <button className="
                h-14
                bg-primary
                text-white
                rounded-lg
                flex
                items-center
                justify-center
                gap-2
                mt-2
            ">
                Login
                <ArrowRight size={20} />
            </button> */}
            <AuthButton
                type="submit"
                loading={loading}
                loadingtext="Logging In..."
            >
                Login
            </AuthButton>
        </form>
    )
}