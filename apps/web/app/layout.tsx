import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../src/styles.css";
import { QueryProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Inovacode - Transformando Ideias em Soluções Digitais",
    description:
        "Soluções digitais inovadoras para transformar suas ideias em realidade. Desenvolvimento web, aplicativos e consultoria tecnológica.",
    keywords: "desenvolvimento web, aplicativos, soluções digitais, tecnologia, inovação, react, node.js",
    openGraph: {
        title: "Inovacode - Transformando Ideias em Soluções Digitais",
        description: "Soluções digitais inovadoras para transformar suas ideias em realidade.",
        type: "website",
        locale: "pt_BR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
