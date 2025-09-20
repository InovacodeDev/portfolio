import React from 'react';
import { Button } from '../components';

export const HeroSection: React.FC = () => {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Transformamos ideias em 
                        <span className="text-accent"> soluções digitais</span>
                    </h1>
                    <p className="hero-subtitle">
                        Na Inovacode, criamos experiências digitais excepcionais que conectam 
                        tecnologia de ponta com design inovador para impulsionar seu negócio.
                    </p>
                    <div className="hero-actions">
                        <Button size="lg">
                            Conheça Nossos Projetos
                        </Button>
                        <Button variant="secondary" size="lg">
                            Fale Conosco
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;