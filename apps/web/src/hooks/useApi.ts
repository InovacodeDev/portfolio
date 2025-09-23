import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiError } from "../lib/api";
import { ContactFormData, ContactResponse } from "../lib/schemas";

interface UseSubmitContactOptions {
    onSuccess?: (data: ContactResponse) => void;
    onError?: (error: ApiError) => void;
}

export const useSubmitContact = (options: UseSubmitContactOptions = {}) => {
    return useMutation({
        mutationFn: (data: ContactFormData) => apiClient.submitContact(data),
        onSuccess: (data) => {
            console.log("Contact form submitted successfully:", data);
            options.onSuccess?.(data);
        },
        onError: (error: ApiError) => {
            console.error("Contact form submission failed:", error);
            options.onError?.(error);
        },
    });
};
