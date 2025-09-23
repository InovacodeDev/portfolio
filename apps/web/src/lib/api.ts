import { ContactFormData, ContactResponse, ContactError } from "./schemas";

// Use relative paths for Next.js API routes
const API_BASE_URL = "/api";

function buildUrl(path: string) {
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

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
            const response = await fetch(buildUrl("/contact"), {
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

    // Health check removido pois não é necessário no Next.js
};
