import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SEO, Navigation } from "./components";
import { HeroSection, SolutionsSection, AboutSection, ContactSection } from "./sections";

// Criar instância do QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5, // 5 minutos
        },
        mutations: {
            retry: 1,
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SEO
                title="Inovacode - Transformando Ideias em Soluções Digitais"
                description="Soluções digitais inovadoras para transformar suas ideias em realidade. Desenvolvimento web, aplicativos e consultoria tecnológica."
                keywords="desenvolvimento web, aplicativos, soluções digitais, tecnologia, inovação, react, node.js"
            />
            <Navigation />
            <main>
                <HeroSection />
                <SolutionsSection />
                {/* <PortfolioSection /> */}
                <AboutSection />
                <ContactSection />
            </main>
        </QueryClientProvider>
    );
}
