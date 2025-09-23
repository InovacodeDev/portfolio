import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as Handlebars from 'handlebars';

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable()
export class EmailService {
  private resend: Resend;
  private contactTemplate: HandlebarsTemplateDelegate;

  constructor(private configService: ConfigService) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    this.resend = new Resend(resendApiKey);
    this.loadTemplates();
  }

  private loadTemplates() {
    try {
      const templatePath = join(process.cwd(), 'templates', 'contact-notification.hbs');
      const templateSource = readFileSync(templatePath, 'utf-8');
      this.contactTemplate = Handlebars.compile(templateSource);
    } catch (error) {
      console.warn('Template not found, using fallback template');
      this.contactTemplate = Handlebars.compile(`
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> {{name}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Assunto:</strong> {{subject}}</p>
        <p><strong>Mensagem:</strong></p>
        <p>{{message}}</p>
      `);
    }
  }

  async sendContactNotification(data: ContactEmailData): Promise<void> {
    const htmlContent = this.contactTemplate(data);

    try {
      await this.resend.emails.send({
        from: 'InovaCode <noreply@inovacode.dev>',
        to: ['contato@inovacode.dev'],
        subject: `Nova mensagem de contato: ${data.subject}`,
        html: htmlContent,
        reply_to: data.email,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email notification');
    }
  }
}