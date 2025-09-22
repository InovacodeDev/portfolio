import { Controller, Get, Post, Req, Res, Body, HttpCode } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { ContactService } from "../services/contact.service";

@Controller("/api/v1")
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Get("/healthz")
    async healthz() {
        return {
            status: "ok",
            database: process.env.DATABASE_URL ? "configured" : "not configured",
            timestamp: new Date().toISOString(),
            version: "1.0.0",
        };
    }

    @Post("/contact")
    @HttpCode(201)
    async submitContact(@Req() req: FastifyRequest, @Res() res: FastifyReply, @Body() body: any) {
        return this.contactService.handleContact(body, req, res);
    }

    @Get("/contacts")
    async listContacts(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return this.contactService.listContacts(req, res);
    }
}
