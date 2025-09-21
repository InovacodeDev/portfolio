import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
            <main>
                <HeroSection />
                <SolutionsSection />
                <AboutSection />
                <ContactSection />
            </main>
        </QueryClientProvider>
    );
}
