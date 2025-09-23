import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/database';
import { sendContactNotification } from '../../lib/email';
import { createContactSchema, ContactResponse } from '../../lib/types';
import { contacts } from '@inovacode/db/schema';

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          message: 'Serviço temporariamente indisponível',
        },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = createContactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Save to database (subject is sent via email but not stored in DB)
    await db.insert(contacts).values({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    // Send email notification (includes subject)
    await sendContactNotification({
      name,
      email,
      subject,
      message,
    });

    const response: ContactResponse = {
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Contact API error:', error);
    
    const response: ContactResponse = {
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.',
    };

    return NextResponse.json(response, { status: 500 });
  }
}