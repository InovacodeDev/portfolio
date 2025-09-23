import { Navigation } from '../src/components';
import { 
  HeroSection, 
  SolutionsSection, 
  AboutSection, 
  ContactSection 
} from '../src/sections';

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