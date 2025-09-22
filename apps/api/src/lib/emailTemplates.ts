import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

const templatePath = path.join(__dirname, "..", "..", "templates", "contact_notification.hbs");

let compiled: ((context?: unknown) => string) | null = null;

function loadTemplate() {
    if (compiled) return compiled;
    const source = fs.readFileSync(templatePath, "utf8");
    compiled = (Handlebars as unknown as { compile: (s: string) => (c?: unknown) => string }).compile(source);
    return compiled;
}

export function renderContactNotification(data: {
    contactId: number;
    name: string;
    email: string;
    messageHtml: string;
    timestamp: string;
    logoUrl?: string;
    siteUrl?: string;
}) {
    const tpl = loadTemplate();
    const logoUrl = data.logoUrl || process.env.SITE_LOGO_URL || "https://inovacode.dev/inovacode-logo.svg";
    const siteUrl = data.siteUrl || process.env.SITE_URL || "https://inovacode.dev";
    if (!tpl) return "";
    return tpl({ ...data, logoUrl, siteUrl });
}
