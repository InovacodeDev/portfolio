import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true, // Permite conexões externas
        strictPort: false, // Permite porta alternativa se ocupada
        cors: true, // Habilita CORS
        open: false, // Não abre browser automaticamente
    },
    build: {
        // Otimizações para produção
        minify: "esbuild", // Usar esbuild que é mais rápido e stable
        // Configuração de chunks para melhor cache
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    query: ["@tanstack/react-query"],
                    forms: ["react-hook-form", "@hookform/resolvers"],
                    animation: ["framer-motion"],
                },
            },
        },
        // Configurações de compressão
        assetsInlineLimit: 4096, // Assets menores que 4KB serão inline
        chunkSizeWarningLimit: 1000,
        // Remoção de console.log em produção
        target: "esnext",
    },
    // Otimizações de dependências
    optimizeDeps: {
        include: ["react", "react-dom", "@tanstack/react-query"],
    },
});
