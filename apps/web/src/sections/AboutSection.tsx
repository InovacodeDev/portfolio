import React from 'react';
import { Card } from '../components';

const aboutItems = [
    {
        title: "Missão",
        content: "Democratizar o acesso à tecnologia de qualidade, criando soluções digitais que transformam negócios e conectam pessoas."
    },
    {
        title: "Visão",
        content: "Ser reconhecida como referência em inovação digital, criando o futuro através de tecnologia acessível e design excepcional."
    },
    {
        title: "Valores",
        content: "Excelência técnica, inovação constante, transparência total e compromisso genuíno com o sucesso de nossos clientes."
    }
];

export const AboutSection: React.FC = () => {
    return (
        <section className="about-section">
            <div className="container">
                <div className="about-content">
                    <div className="about-text">
                        <h2>Sobre a Inovacode</h2>
                        <p className="about-description">
                            Somos uma empresa de tecnologia especializada em criar experiências 
                            digitais excepcionais. Com uma equipe apaixonada por inovação, 
                            transformamos ideias complexas em soluções simples e eficazes.
                        </p>
                        <p className="about-description">
                            Nossa abordagem combina expertise técnica com design centrado no 
                            usuário, garantindo que cada projeto não apenas funcione perfeitamente, 
                            mas também encante quem o utiliza.
                        </p>
                    </div>
                    
                    <div className="about-items">
                        {aboutItems.map((item, index) => (
                            <Card 
                                key={index}
                                title={item.title}
                                className="about-card"
                                hoverable={false}
                            >
                                <p>{item.content}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;