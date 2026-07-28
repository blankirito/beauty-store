import {
    UserRound,
    SlidersHorizontal,
    Settings,
    ShieldCheck,

    Badge,
    LockKeyhole,
    Bell,
    Mail,
    Languages,
    Moon,
    Shield,
    LogOut
} from "lucide-react";


export const settingsSections = [

    {
        title:"Account",
        icon: UserRound,
        color: "primary",

        items:[
            {
                title:"Personal Information",
                description:"Update your name, bio, and delivery address",
                icon: Badge,
                type:"link",
                href:"/settings/account"
            },
            {
                title:"Password",
                description:"Change your account password for better security",
                icon: LockKeyhole,
                type:"link",
                href:"/settings/password"
            }
        ]
    },


    // {
    //     title:"Preferences",
    //     icon: SlidersHorizontal,
    //     color: "secondary",

    //     items:[
    //         {
    //             title:"Push Notifications",
    //             description:"Get alerts for new releases and skincare tips",
    //             icon: Bell,
    //             type:"toggle"
    //         },
    //         {
    //             title:"Email Subscriptions",
    //             description:"Manage newsletters and promotional offers",
    //             icon: Mail,
    //             type:"link"
    //         }
    //     ]
    // },


    // {
    //     title:"Application",
    //     icon: Settings,
    //     color: "tertiary",

    //     items:[
    //         {
    //             title:"Language",
    //             description:"English (United Kingdom)",
    //             icon: Languages,
    //             type:"link"
    //         },
    //         {
    //             title:"Theme",
    //             description:"Switch between Light and Dark aesthetic",
    //             icon: Moon,
    //             type:"theme"
    //         }
    //     ]
    // },


    // {
    //     title:"Security",
    //     icon: ShieldCheck,
    //     color: "error",

    //     items:[
    //         {
    //             title:"Privacy Settings",
    //             description:"Data usage and tracking permissions",
    //             icon: Shield,
    //             type:"link"
    //         },
    //         {
    //             title:"Logout from all devices",
    //             description:"Instantly sign out from every active session",
    //             icon: LogOut,
    //             type:"danger"
    //         }
    //     ]
    // }

] as const;