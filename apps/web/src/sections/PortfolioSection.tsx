import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components";

interface PortfolioItem {
    id: number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    link: string;
}

const portfolioItems: PortfolioItem[] = [
    {
        id: 1,
        title: "E-commerce Inovador",
        description:
            "Plataforma de e-commerce completa com integração de pagamentos, gestão de estoque e dashboard administrativo avançado.",
        image: "/placeholder-portfolio-1.jpg",
        tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
        link: "/portfolio/ecommerce",
    },
    {
        id: 2,
        title: "Sistema de Gestão Empresarial",
        description:
            "Sistema completo para gestão empresarial com módulos de CRM, vendas, financeiro e relatórios em tempo real.",
        image: "/placeholder-portfolio-2.jpg",
        tags: ["Next.js", "TypeScript", "Prisma", "Chart.js"],
        link: "/portfolio/sistema-gestao",
    },
    {
        id: 3,
        title: "Aplicativo Mobile de Delivery",
        description: "App mobile para delivery com geolocalização, rastreamento em tempo real e sistema de avaliações.",
        image: "/placeholder-portfolio-3.jpg",
        tags: ["React Native", "Firebase", "Google Maps", "Push Notifications"],
        link: "/portfolio/app-delivery",
    },
];

export const PortfolioSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = React.useRef<HTMLDivElement | null>(null);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === portfolioItems.length - 1 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? portfolioItems.length - 1 : prevIndex - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const currentItem = portfolioItems[currentIndex];

    // Avança automaticamente o slide a cada 6s, pausa quando `isPaused` é true
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) nextSlide();
        }, 6000);
        return () => clearInterval(interval);
    }, [isPaused]);

    // Suporte a teclado (setas esquerda/direita) — listener global ao window (limpo no unmount)
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") nextSlide();
            if (e.key === "ArrowLeft") prevSlide();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    return (
        <section id="portfolio" className="portfolio-section portfolio-fullscreen" aria-label="Seção de portfolio">
            <div className="container portfolio-container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2>Nosso Portfolio</h2>
                    <p className="section-subtitle">
                        Conheça alguns dos projetos que desenvolvemos e como transformamos ideias em soluções digitais
                        de sucesso.
                    </p>
                </motion.div>

                <div className="portfolio-carousel portfolio-carousel-fullscreen">
                    <div
                        className="carousel-container carousel-container-fullscreen"
                        ref={carouselRef}
                        tabIndex={0}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentItem.id}
                                className="portfolio-slide"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                <div className="portfolio-content portfolio-content-fullscreen">
                                    <div className="portfolio-image portfolio-image-fullscreen">
                                        <img
                                            src={currentItem.image}
                                            alt={currentItem.title}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                const svgContent =
                                                    currentItem.id === 1
                                                        ? `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
                                                        <defs>
                                                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                                                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect width="100%" height="100%" fill="url(#grad1)"/>
                                                        <rect x="50" y="80" width="500" height="240" rx="15" fill="white" opacity="0.1"/>
                                                        <circle cx="150" cy="160" r="30" fill="white" opacity="0.3"/>
                                                        <rect x="200" y="140" width="250" height="40" rx="20" fill="white" opacity="0.2"/>
                                                        <rect x="200" y="200" width="180" height="15" rx="7" fill="white" opacity="0.15"/>
                                                        <rect x="200" y="230" width="220" height="15" rx="7" fill="white" opacity="0.15"/>
                                                        <rect x="200" y="260" width="120" height="25" rx="12" fill="#4CAF50" opacity="0.8"/>
                                                        <text x="300" y="340" font-family="Inter, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.9">E-commerce Platform</text>
                                                    </svg>`
                                                        : currentItem.id === 2
                                                          ? `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
                                                        <defs>
                                                            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style="stop-color:#11998e;stop-opacity:1" />
                                                                <stop offset="100%" style="stop-color:#38ef7d;stop-opacity:1" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect width="100%" height="100%" fill="url(#grad2)"/>
                                                        <rect x="80" y="60" width="440" height="280" rx="20" fill="white" opacity="0.1"/>
                                                        <rect x="100" y="80" width="400" height="40" rx="5" fill="white" opacity="0.2"/>
                                                        <rect x="100" y="140" width="190" height="120" rx="10" fill="white" opacity="0.15"/>
                                                        <rect x="310" y="140" width="190" height="120" rx="10" fill="white" opacity="0.15"/>
                                                        <circle cx="150" cy="200" r="25" fill="#FF6B6B" opacity="0.7"/>
                                                        <circle cx="360" cy="200" r="25" fill="#4ECDC4" opacity="0.7"/>
                                                        <rect x="100" y="280" width="400" height="40" rx="5" fill="white" opacity="0.2"/>
                                                        <text x="300" y="350" font-family="Inter, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.9">Business Dashboard</text>
                                                    </svg>`
                                                          : `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
                                                        <defs>
                                                            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style="stop-color:#ee0979;stop-opacity:1" />
                                                                <stop offset="100%" style="stop-color:#ff6a00;stop-opacity:1" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect width="100%" height="100%" fill="url(#grad3)"/>
                                                        <rect x="200" y="60" width="200" height="320" rx="25" fill="white" opacity="0.1"/>
                                                        <rect x="220" y="80" width="160" height="25" rx="12" fill="white" opacity="0.3"/>
                                                        <rect x="220" y="120" width="160" height="180" rx="15" fill="white" opacity="0.15"/>
                                                        <circle cx="270" cy="180" r="20" fill="#FF4757" opacity="0.8"/>
                                                        <circle cx="330" cy="180" r="20" fill="#2ED573" opacity="0.8"/>
                                                        <rect x="240" y="220" width="120" height="15" rx="7" fill="white" opacity="0.2"/>
                                                        <rect x="240" y="245" width="80" height="15" rx="7" fill="white" opacity="0.2"/>
                                                        <rect x="220" y="320" width="160" height="40" rx="20" fill="white" opacity="0.2"/>
                                                        <text x="300" y="370" font-family="Inter, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.9">Mobile Delivery App</text>
                                                    </svg>`;
                                                target.src = `data:image/svg+xml;base64,${btoa(svgContent)}`;
                                            }}
                                        />
                                    </div>
                                    <div className="portfolio-info portfolio-info-fullscreen">
                                        <h3>{currentItem.title}</h3>
                                        <p aria-live="polite">{currentItem.description}</p>
                                        <div className="portfolio-tags">
                                            {currentItem.tags.map((tag, index) => (
                                                <span key={index} className="tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Button size="lg" onClick={() => window.open(currentItem.link, "_blank")}>
                                            Saiba Mais
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Controles do Carrosel */}
                        <div className="carousel-controls" role="group" aria-label="Controles do carrossel">
                            <button
                                className="carousel-btn carousel-btn-prev"
                                onClick={prevSlide}
                                aria-label="Projeto anterior"
                            >
                                ←
                            </button>
                            <button
                                className="carousel-btn carousel-btn-next"
                                onClick={nextSlide}
                                aria-label="Próximo projeto"
                            >
                                →
                            </button>
                        </div>

                        {/* Indicadores */}
                        <div className="carousel-indicators">
                            {portfolioItems.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentIndex ? "active" : ""}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Ir para projeto ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortfolioSection;
