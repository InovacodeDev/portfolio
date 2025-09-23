import { Navigation } from "@/components";
import { HeroSection, SolutionsSection, AboutSection, ContactSection } from "@/components/sections";

export default function HomePage() {
    return (
        <>
            <Navigation />
            <main>
                <HeroSection />
                <SolutionsSection />
                <AboutSection />
                <ContactSection />
            </main>
        </>
    );
}
