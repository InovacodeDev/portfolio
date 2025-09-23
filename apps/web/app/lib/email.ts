import { Resend } from "resend";

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

// Simple template function to replace Handlebars for serverless compatibility
function renderContactTemplate(data: ContactEmailData): string {
    return `
<html>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Nova Mensagem de Contato - InovaCode</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background: #f9f9f9;
        padding: 30px;
        border-radius: 0 0 8px 8px;
        border: 1px solid #e1e1e1;
      }
      .field {
        margin-bottom: 20px;
        padding: 15px;
        background: white;
        border-radius: 5px;
        border-left: 4px solid #667eea;
      }
      .field-label {
        font-weight: bold;
        color: #555;
        margin-bottom: 5px;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 1px;
      }
      .field-value {
        color: #333;
        font-size: 14px;
        line-height: 1.5;
      }
      .message-content {
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #666;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class='header'>
      <h1>🚀 Nova Mensagem de Contato</h1>
      <p>Recebida através do site InovaCode</p>
    </div>
    
    <div class='content'>
      <div class='field'>
        <div class='field-label'>Nome do Cliente</div>
        <div class='field-value'>${data.name}</div>
      </div>
      
      <div class='field'>
        <div class='field-label'>Email para Contato</div>
        <div class='field-value'>${data.email}</div>
      </div>
      
      <div class='field'>
        <div class='field-label'>Assunto</div>
        <div class='field-value'>${data.subject}</div>
      </div>
      
      <div class='field'>
        <div class='field-label'>Mensagem</div>
        <div class='field-value message-content'>${data.message}</div>
      </div>
    </div>
    
    <div class='footer'>
      <p>Esta mensagem foi enviada através do formulário de contato do site InovaCode.</p>
      <p>Para responder, utilize o email: ${data.email}</p>
    </div>
  </body>
</html>
`;
}

export async function sendContactNotification(data: ContactEmailData): Promise<void> {
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
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email notification");
    }
}
