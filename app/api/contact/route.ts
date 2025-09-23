import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema, ContactResponse } from "../../../src/types";
import { sendContactNotification } from "../../../src/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validationResult = contactFormSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Dados inválidos",
                    errors: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        const { name, email, subject, message } = validationResult.data;

        // Log the contact form data (for development)
        console.log("Contact form submission:", {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString(),
        });

        // Try to send email notification
        try {
            await sendContactNotification({
                name,
                email,
                subject,
                message,
            });
            console.log("Email notification sent successfully");
        } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            // Don't fail the entire request if email fails - just log the error
        }

        const response: ContactResponse = {
            success: true,
            id: Math.floor(Math.random() * 1000), // Mock ID
            message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
            timestamp: new Date().toISOString(),
        };

        // Simulate some processing time
        await new Promise((resolve) => setTimeout(resolve, 500));

        return NextResponse.json(response);
    } catch (error) {
        console.error("Contact API error:", error);

        const response: ContactResponse = {
            success: false,
            message: "Erro interno do servidor. Tente novamente mais tarde.",
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json(response, { status: 500 });
    }
}
