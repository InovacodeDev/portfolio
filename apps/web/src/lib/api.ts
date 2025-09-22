import { ContactFormData, ContactResponse, ContactError } from "./schemas";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Classe de erro personalizada para erros da API
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: ContactError
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// Cliente de API para comunicação com o backend
export const apiClient = {
    // Submeter formulário de contato
    async submitContact(data: ContactFormData): Promise<ContactResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new ApiError(responseData.message || "Erro ao enviar mensagem", response.status, responseData);
            }

            return responseData;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            // Erro de rede ou outro erro não relacionado à API
            throw new ApiError("Erro de conexão. Verifique sua internet e tente novamente.", 0);
        }
    },

    // Health check do servidor
    async healthCheck(): Promise<{ status: string; database: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/healthz`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error("Health check failed");
            }

            return data;
        } catch {
            throw new Error("Servidor indisponível");
        }
    },
};
