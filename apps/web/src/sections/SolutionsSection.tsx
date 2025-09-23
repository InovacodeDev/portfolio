"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "../components";
import { useSectionAnimation, useCardAnimation } from "../hooks/useScrollAnimation";

const solutions = [
    {
        title: "Desenvolvimento Web",
        description:
            "Criamos aplicações web modernas e responsivas utilizando as mais recentes tecnologias do mercado.",
        features: ["React & Vite", "TypeScript", "Tailwind CSS", "Performance Otimizada"],
    },
    {
        title: "Aplicações Mobile",
        description:
            "Desenvolvemos apps nativos e híbridos que proporcionam experiências excepcionais em dispositivos móveis.",
        features: ["React Native", "iOS & Android", "Expo", "Integração com APIs"],
    },
    {
        title: "Soluções Backend",
        description:
            "Construímos APIs robustas e escaláveis que sustentam suas aplicações com segurança e performance.",
        features: ["Node.js & FastAPI", "Bancos de Dados", "Arquitetura Cloud", "Microserviços"],
    },
];

export const SolutionsSection: React.FC = () => {
    const headerAnimation = useSectionAnimation(0);
    const card1Animation = useCardAnimation(1);
    const card2Animation = useCardAnimation(2);
    const card3Animation = useCardAnimation(3);

    const cardAnimations = [card1Animation, card2Animation, card3Animation];

    return (
        <section id="services" className="solutions-section" aria-label="Nossos serviços">
            <div className="container">
                <motion.div
                    className="section-header"
                    ref={headerAnimation.ref}
                    initial={headerAnimation.initial}
                    animate={headerAnimation.animate}
                >
                    <h2>Nossas Soluções</h2>
                    <p className="section-subtitle">
                        Oferecemos um conjunto completo de serviços para transformar sua visão em realidade digital
                    </p>
                </motion.div>

                <div className="solutions-grid">
                    {solutions.map((solution, index) => {
                        const cardAnimation = cardAnimations[index];

                        return (
                            <motion.div
                                key={index}
                                ref={cardAnimation.ref}
                                initial={cardAnimation.initial}
                                animate={cardAnimation.animate}
                            >
                                <Card title={solution.title} className="solution-card">
                                    <p className="solution-description">{solution.description}</p>
                                    <ul className="solution-features">
                                        {solution.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="solution-feature">
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SolutionsSection;
