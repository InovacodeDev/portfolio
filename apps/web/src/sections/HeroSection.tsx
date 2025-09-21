import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components";
import { useSectionAnimation } from "../hooks/useScrollAnimation";

export const HeroSection: React.FC = () => {
    const heroAnimation = useSectionAnimation(0);
    const titleAnimation = useSectionAnimation(1);
    const subtitleAnimation = useSectionAnimation(2);
    const buttonsAnimation = useSectionAnimation(3);

    return (
        <section id="home" className="hero-section" aria-label="Seção principal">
            <div className="container">
                <motion.div
                    className="hero-content"
                    ref={heroAnimation.ref}
                    initial={heroAnimation.initial}
                    animate={heroAnimation.animate}
                >
                    <motion.h1 className="hero-title" initial={titleAnimation.initial} animate={titleAnimation.animate}>
                        Transformamos ideias em
                        <span className="text-accent"> soluções digitais</span>
                    </motion.h1>
                    <motion.p
                        className="hero-subtitle"
                        initial={subtitleAnimation.initial}
                        animate={subtitleAnimation.animate}
                    >
                        Na Inovacode, criamos experiências digitais excepcionais que conectam tecnologia de ponta com
                        design inovador para impulsionar seu negócio.
                    </motion.p>
                    <motion.div
                        className="hero-actions"
                        initial={buttonsAnimation.initial}
                        animate={buttonsAnimation.animate}
                    >
                        <Button size="lg">Conheça Nossos Projetos</Button>
                        <Button variant="secondary" size="lg">
                            Fale Conosco
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
