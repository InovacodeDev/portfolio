import React from "react";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title = "Inovacode - Transformando Ideias em Soluções Digitais",
    description = "Soluções digitais inovadoras para transformar suas ideias em realidade. Desenvolvimento web, aplicativos e consultoria tecnológica.",
    keywords = "desenvolvimento web, aplicativos, soluções digitais, tecnologia, inovação",
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard = "summary_large_image",
}) => {
    React.useEffect(() => {
        // Atualizar título da página
        document.title = title;

        // Função para atualizar ou criar meta tag
        const updateMetaTag = (name: string, content: string, attribute: string = "name") => {
            let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
            if (element) {
                element.content = content;
            } else {
                element = document.createElement("meta");
                element.setAttribute(attribute, name);
                element.content = content;
                document.head.appendChild(element);
            }
        };

        // Atualizar meta tags
        updateMetaTag("description", description);
        updateMetaTag("keywords", keywords);
        updateMetaTag("og:title", ogTitle || title, "property");
        updateMetaTag("og:description", ogDescription || description, "property");
        updateMetaTag("twitter:card", twitterCard);

        if (ogImage) {
            updateMetaTag("og:image", ogImage, "property");
        }
    }, [title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard]);

    return null; // Componente não renderiza nada visível
};
