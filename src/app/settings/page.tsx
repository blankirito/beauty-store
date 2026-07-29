import Navbar2 from "@/components/shared/Navbar2";
import SettingsHeader from "@/components/setting/SettingsHeader";
import SettingsSection from "@/components/setting/SettingsSection";
import { settingsSections } from "@/components/setting/settingsData";


export default function SettingsPage(){

    return(
        <>
         <Navbar2 />
         <main
            className="
                min-h-screen
                bg-background
                px-5
                py-5
            "
        >
            <div
                className="
                    max-w-[1000px]
                    mx-auto
                "
            >
                <SettingsHeader />
                <div
                    className="
                        space-y-10
                    "
                >
                    {
                        settingsSections.map((section)=>(

                            <SettingsSection
                                key={section.title}
                                section={section}
                            />

                        ))
                    }
                </div>
            </div>
        </main>
        </>
       
    )
}