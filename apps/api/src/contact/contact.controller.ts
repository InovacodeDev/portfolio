import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createContactDto: CreateContactDto) {
    try {
      await this.contactService.create(createContactDto);
      return {
        success: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      };
    } catch (error) {
      throw error;
    }
  }
}