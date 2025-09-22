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
            className="fixed top-4 right-4 z-50 card rounded-lg shadow-lg"
            style={{ backgroundColor: "var(--color-card-background)" }}
            aria-label="Navegação principal"
        >
            <ul className="flex flex-col gap-2" style={{ padding: "16px" }}>
                <li>
                    <button
                        onClick={() => scrollToSection("home")}
                        className="px-3 py-2 text-sm transition-colors"
                        style={{
                            color: "var(--color-text-primary)",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                        aria-label="Ir para seção inicial"
                    >
                        Início
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => scrollToSection("services")}
                        className="px-3 py-2 text-sm transition-colors"
                        style={{
                            color: "var(--color-text-primary)",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                        aria-label="Ir para seção de serviços"
                    >
                        Serviços
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => scrollToSection("about")}
                        className="px-3 py-2 text-sm transition-colors"
                        style={{
                            color: "var(--color-text-primary)",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                        aria-label="Ir para seção sobre nós"
                    >
                        Sobre
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => scrollToSection("contact")}
                        className="px-3 py-2 text-sm transition-colors"
                        style={{
                            color: "var(--color-text-primary)",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                        aria-label="Ir para seção de contato"
                    >
                        Contato
                    </button>
                </li>
            </ul>
        </nav>
    );
};
