import React from 'react';
import { Card } from '../components';

const solutions = [
    {
        title: "Desenvolvimento Web",
        description: "Criamos aplicações web modernas e responsivas utilizando as mais recentes tecnologias do mercado.",
        features: ["React & Next.js", "TypeScript", "Design Responsivo", "Performance Otimizada"]
    },
    {
        title: "Aplicações Mobile",
        description: "Desenvolvemos apps nativos e híbridos que proporcionam experiências excepcionais em dispositivos móveis.",
        features: ["React Native", "iOS & Android", "UX/UI Design", "Integração com APIs"]
    },
    {
        title: "Soluções Backend",
        description: "Construímos APIs robustas e escaláveis que sustentam suas aplicações com segurança e performance.",
        features: ["Node.js & FastAPI", "Bancos de Dados", "Arquitetura Cloud", "Microserviços"]
    }
];

export const SolutionsSection: React.FC = () => {
    return (
        <section className="solutions-section">
            <div className="container">
                <div className="section-header">
                    <h2>Nossas Soluções</h2>
                    <p className="section-subtitle">
                        Oferecemos um conjunto completo de serviços para transformar 
                        sua visão em realidade digital
                    </p>
                </div>
                
                <div className="solutions-grid">
                    {solutions.map((solution, index) => (
                        <Card 
                            key={index}
                            title={solution.title}
                            className="solution-card"
                        >
                            <p className="solution-description">
                                {solution.description}
                            </p>
                            <ul className="solution-features">
                                {solution.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="solution-feature">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SolutionsSection;