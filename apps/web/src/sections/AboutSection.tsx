import React from "react";
import { motion } from "framer-motion";
import { Card } from "../components";
import { useSectionAnimation, useCardAnimation } from "../hooks/useScrollAnimation";

const aboutItems = [
    {
        title: "Missão",
        content:
            "Democratizar o acesso à tecnologia de qualidade, criando soluções digitais que transformam negócios e conectam pessoas.",
    },
    {
        title: "Visão",
        content:
            "Ser reconhecida como referência em inovação digital, criando o futuro através de tecnologia acessível e design excepcional.",
    },
    {
        title: "Valores",
        content:
            "Excelência técnica, inovação constante, transparência total e compromisso genuíno com o sucesso de nossos clientes.",
    },
];

export const AboutSection: React.FC = () => {
    const textAnimation = useSectionAnimation(0);
    const card1Animation = useCardAnimation(1);
    const card2Animation = useCardAnimation(2);
    const card3Animation = useCardAnimation(3);

    const cardAnimations = [card1Animation, card2Animation, card3Animation];

    return (
        <section id="about" className="about-section" aria-label="Sobre nós">
            <div className="container">
                <div className="about-content">
                    <motion.div
                        className="about-text"
                        ref={textAnimation.ref}
                        initial={textAnimation.initial}
                        animate={textAnimation.animate}
                    >
                        <h2>Sobre a Inovacode</h2>
                        <p className="about-description">
                            Somos uma empresa de tecnologia especializada em criar experiências digitais excepcionais.
                            Com uma equipe apaixonada por inovação, transformamos ideias complexas em soluções simples e
                            eficazes.
                        </p>
                        <p className="about-description">
                            Nossa abordagem combina expertise técnica com design centrado no usuário, garantindo que
                            cada projeto não apenas funcione perfeitamente, mas também encante quem o utiliza.
                        </p>
                    </motion.div>

                    <div className="about-items">
                        {aboutItems.map((item, index) => {
                            const cardAnimation = cardAnimations[index];

                            return (
                                <motion.div
                                    key={index}
                                    ref={cardAnimation.ref}
                                    initial={cardAnimation.initial}
                                    animate={cardAnimation.animate}
                                >
                                    <Card title={item.title} className="about-card" hoverable={false}>
                                        <p>{item.content}</p>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
