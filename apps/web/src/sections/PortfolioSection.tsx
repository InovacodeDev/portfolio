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

    return (
        <section id="portfolio" className="portfolio-section" aria-label="Seção de portfolio">
            <div className="container">
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

                <div className="portfolio-carousel">
                    <div className="carousel-container">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentItem.id}
                                className="portfolio-slide"
                                initial={{ opacity: 0, x: 300 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -300 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <div className="portfolio-content">
                                    <div className="portfolio-image">
                                        <img
                                            src={currentItem.image}
                                            alt={currentItem.title}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `data:image/svg+xml;base64,${btoa(`
                                                    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="100%" height="100%" fill="#2a2a2a"/>
                                                        <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="20" fill="#a2b9d1" text-anchor="middle" dy=".3em">
                                                            ${currentItem.title}
                                                        </text>
                                                    </svg>
                                                `)}`;
                                            }}
                                        />
                                    </div>
                                    <div className="portfolio-info">
                                        <h3>{currentItem.title}</h3>
                                        <p>{currentItem.description}</p>
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
                        <div className="carousel-controls">
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
