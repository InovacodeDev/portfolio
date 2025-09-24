import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema, ContactResponse } from "../../../src/types";
import { sendContactNotification } from "../../../src/lib/email";
import { createHash } from "crypto";

// Rate limiting configuration
const RATE_LIMIT_MINUTES = 30;
const RATE_LIMIT_MS = RATE_LIMIT_MINUTES * 60 * 1000; // 30 minutes in milliseconds
const COOKIE_NAME = "contact_rate_limit";

function createEmailHash(email: string): string {
    return createHash("sha256").update(email.toLowerCase().trim()).digest("hex").substring(0, 16);
}

function checkRateLimit(request: NextRequest, email: string): boolean {
    const emailHash = createEmailHash(email);
    const cookieValue = request.cookies.get(COOKIE_NAME)?.value;

    if (!cookieValue) {
        return true; // No cookie, allow request
    }

    try {
        const rateLimitData = JSON.parse(cookieValue);
        const currentTime = Date.now();

        // Check if this email hash exists and is within rate limit
        if (rateLimitData[emailHash]) {
            const lastSentTime = rateLimitData[emailHash];
            const timeDifference = currentTime - lastSentTime;

            if (timeDifference < RATE_LIMIT_MS) {
                return false; // Rate limited
            }
        }

        return true; // Not rate limited
    } catch (error) {
        console.error("Error parsing rate limit cookie:", error);
        return true; // If error parsing cookie, allow request
    }
}

function updateRateLimit(email: string, existingCookieValue?: string): string {
    const emailHash = createEmailHash(email);
    const currentTime = Date.now();

    let rateLimitData: Record<string, number> = {};

    if (existingCookieValue) {
        try {
            rateLimitData = JSON.parse(existingCookieValue);
        } catch (error) {
            console.error("Error parsing existing cookie:", error);
        }
    }

    // Clean old entries (older than rate limit period)
    Object.keys(rateLimitData).forEach((hash) => {
        if (currentTime - rateLimitData[hash] > RATE_LIMIT_MS) {
            delete rateLimitData[hash];
        }
    });

    // Add current email hash
    rateLimitData[emailHash] = currentTime;

    return JSON.stringify(rateLimitData);
}

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

        const { name, email, 'project-name': projectName, project } = validationResult.data;

        // Check rate limiting
        if (!checkRateLimit(request, email)) {
            const minutesRemaining = Math.ceil(
                RATE_LIMIT_MINUTES -
                    (Date.now() - JSON.parse(request.cookies.get(COOKIE_NAME)?.value || "{}")[createEmailHash(email)]) /
                        (60 * 1000)
            );

            return NextResponse.json(
                {
                    success: false,
                    message: `Você já enviou uma mensagem recentemente. Tente novamente em ${minutesRemaining} minuto(s).`,
                    rateLimited: true,
                    timestamp: new Date().toISOString(),
                },
                { status: 429 }
            );
        }

        // Log the contact form data (for development)
        console.log("Contact form submission:", {
            name,
            email,
            projectName,
            project,
            timestamp: new Date().toISOString(),
        });

        // Try to send email notification
        try {
            await sendContactNotification({
                name,
                email,
                'project-name': projectName,
                project,
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

        // Update rate limit cookie
        const existingCookieValue = request.cookies.get(COOKIE_NAME)?.value;
        const newCookieValue = updateRateLimit(email, existingCookieValue);

        // Create response with updated cookie
        const nextResponse = NextResponse.json(response);
        nextResponse.cookies.set({
            name: COOKIE_NAME,
            value: newCookieValue,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: RATE_LIMIT_MS / 1000, // Convert to seconds
            path: "/",
        });

        return nextResponse;
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
