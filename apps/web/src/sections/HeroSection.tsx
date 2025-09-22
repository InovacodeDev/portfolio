import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components";

import Logo from "../assets/inovacode_logo_text_white.png";

export const HeroSection: React.FC = () => {
    return (
        <section id="home" className="hero-section" aria-label="Seção principal">
            <div className="container">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        className="hero-brand"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{
                            marginBottom: "16px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={Logo}
                            alt="INOVACODE"
                            style={{
                                height: "150px",
                                width: "auto",
                                maxWidth: "282px",
                            }}
                        />
                    </motion.div>
                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Transformamos ideias em
                        <span className="text-accent"> soluções digitais</span>
                    </motion.h1>
                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Na Inovacode, criamos experiências digitais excepcionais que conectam tecnologia de ponta com
                        design inovador para impulsionar seu negócio.
                    </motion.p>
                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
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
