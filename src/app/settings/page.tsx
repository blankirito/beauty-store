import Navbar from "@/components/shared/Navbar";
import SettingsHeader from "@/components/setting/SettingsHeader";
import SettingsSection from "@/components/setting/SettingsSection";
import { settingsSections } from "@/components/setting/settingsData";


export default function SettingsPage(){

    return(
        <main
            className="
                min-h-screen
                bg-background
                px-5
                md:px-16
                py-12
            "
        >

            <Navbar />

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
    )
}