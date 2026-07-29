"use client";

import AuthInput from "@/components/auth/AuthInput";
import { User, Mail, Phone } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";


export default function AccountForm(){

    return(

        <form
            className="
                space-y-6
            "
        >

            <AuthInput
                label="Full Name"
                placeholder="Your Full Name"
                icon={User}
            />


            <AuthInput
                label="Email Address"
                placeholder="your.email@gmail.com"
                icon={Mail}
                type="email"
            />


            <AuthInput
                label="Phone Number"
                placeholder="+60 12-345 6789"
                icon={Phone}
                type="tel"
            />


            <div className="pt-8">

                <AuthButton>
                    Save Changes
                </AuthButton>

            </div>


        </form>

    )
}