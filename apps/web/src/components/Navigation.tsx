import React from "react";

export const Navigation: React.FC = () => {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav
            className="fixed top-4 right-4 z-50 bg-surface-container rounded-lg p-2 shadow-lg"
            aria-label="Navegação principal"
        >
            <ul className="flex flex-col space-y-2">
                <li>
                    <button
                        onClick={() => scrollToSection("home")}
                        className="px-3 py-2 text-sm text-on-surface hover:text-primary transition-colors"
                        aria-label="Ir para seção inicial"
                    >
                        Início
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => scrollToSection("services")}
                        className="px-3 py-2 text-sm text-on-surface hover:text-primary transition-colors"
                        aria-label="Ir para seção de serviços"
                    >
                        Serviços
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => scrollToSection("about")}
                        className="px-3 py-2 text-sm text-on-surface hover:text-primary transition-colors"
                        aria-label="Ir para seção sobre nós"
                    >
                        Sobre
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => scrollToSection("contact")}
                        className="px-3 py-2 text-sm text-on-surface hover:text-primary transition-colors"
                        aria-label="Ir para seção de contato"
                    >
                        Contato
                    </button>
                </li>
            </ul>
        </nav>
    );
};
