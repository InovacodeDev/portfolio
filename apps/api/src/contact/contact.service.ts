import { Injectable, Inject } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { EmailService } from './email.service';
import { DATABASE_CONNECTION } from '../database/database.module';
import { contacts } from '@inovacode/db/schema';
import type { DrizzleDB } from '../types/database.types';

@Injectable()
export class ContactService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: DrizzleDB,
    private emailService: EmailService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const { name, email, subject, message } = createContactDto;

    // Save to database (subject is sent via email but not stored in DB)
    await this.db.insert(contacts).values({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    // Send email notification (includes subject)
    await this.emailService.sendContactNotification({
      name,
      email,
      subject,
      message,
    });

    return { success: true };
  }
}