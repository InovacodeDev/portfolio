import { Resend } from "resend";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

interface ContactEmailData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY environment variable is not set");
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Cache do template compilado
let compiledTemplate: HandlebarsTemplateDelegate | null = null;

function getCompiledTemplate(): HandlebarsTemplateDelegate {
    if (!compiledTemplate) {
        try {
            // Caminho para o template - usar path absoluto para serverless
            const templatePath = path.join(process.cwd(), "app", "templates", "contact-notification.hbs");
            const templateSource = fs.readFileSync(templatePath, "utf8");
            compiledTemplate = Handlebars.compile(templateSource);
        } catch (error) {
            console.error("Error loading Handlebars template:", error);
            // Fallback para um template simples
            const fallbackTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nova Mensagem de Contato - InovaCode</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background-color: #282828; 
            color: #f5f5f5; 
            padding: 20px; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #1e1e1e; 
            padding: 30px; 
            border-radius: 8px; 
        }
        .header { 
            background-color: #f5f5f5; 
            color: #282828; 
            padding: 20px; 
            text-align: center; 
            border-radius: 8px 8px 0 0; 
        }
        .content { 
            padding: 20px; 
        }
        .field { 
            margin-bottom: 15px; 
            padding: 15px; 
            background-color: #282828; 
            border-radius: 5px; 
        }
        .label { 
            font-weight: bold; 
            color: #f5f5f5; 
            margin-bottom: 5px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>INOVACODE</h1>
            <h2>Nova Mensagem de Contato</h2>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Nome:</div>
                <div>{{name}}</div>
            </div>
            <div class="field">
                <div class="label">Email:</div>
                <div>{{email}}</div>
            </div>
            <div class="field">
                <div class="label">Assunto:</div>
                <div>{{subject}}</div>
            </div>
            <div class="field">
                <div class="label">Mensagem:</div>
                <div>{{message}}</div>
            </div>
            <div class="field">
                <div class="label">Data:</div>
                <div>{{timestamp}}</div>
            </div>
        </div>
    </div>
</body>
</html>`;
            compiledTemplate = Handlebars.compile(fallbackTemplate);
        }
    }
    return compiledTemplate;
}

function renderContactTemplate(data: ContactEmailData): string {
    const template = getCompiledTemplate();

    const templateData = {
        ...data,
        timestamp: new Date().toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
    };

    return template(templateData);
}

export async function sendContactNotification(data: ContactEmailData): Promise<void> {
    console.log("Sending contact notification...");
    if (!resend) {
        console.warn("Resend not configured, skipping email notification");
        return;
    }

    const htmlContent = renderContactTemplate(data);

    try {
        await resend.emails.send({
            from: "InovaCode <noreply@inovacode.dev>",
            to: ["contato@inovacode.dev"],
            subject: `Nova mensagem de contato: ${data.subject}`,
            html: htmlContent,
            reply_to: data.email,
        });
        console.log("Contact notification sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email notification");
    }
}
