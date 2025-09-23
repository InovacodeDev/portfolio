import { ContactFormData, ContactResponse, ContactError } from "../types";

// Use relative paths for Next.js API routes
const API_BASE_URL = "/api";

function buildUrl(path: string) {
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Classe de erro personalizada para erros da API
export class ApiError extends Error {
    constructor(message: string, public status: number, public data?: ContactError) {
        super(message);
        this.name = "ApiError";
    }
}

// Cliente de API para comunicação com o backend
export const apiClient = {
    // Submeter formulário de contato
    async submitContact(data: ContactFormData): Promise<ContactResponse> {
        try {
            console.log("Submitting contact form...", data);

            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(buildUrl("/contact"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            let responseData;
            try {
                responseData = await response.json();
            } catch (parseError) {
                console.error("Failed to parse response:", parseError);
                throw new ApiError("Resposta inválida do servidor", response.status);
            }

            if (!response.ok) {
                const errorMessage = responseData.message || `Erro ${response.status}: ${response.statusText}`;
                throw new ApiError(errorMessage, response.status, responseData);
            }

            return responseData;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("API Error:", error);

            // Check if it's an abort error (timeout)
            if (error instanceof Error && error.name === "AbortError") {
                throw new ApiError("Timeout: A requisição demorou muito para responder.", 408);
            }

            // Check if it's a network error
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new ApiError("Erro de conexão. Verifique sua internet.", 0);
            }

            throw new ApiError("Erro de rede", 0);
        }
    },
};
