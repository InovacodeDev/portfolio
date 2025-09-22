# Contact Form Email Notification

## Overview

This feature implements email notifications for new contact form submissions. When a user submits the contact form, the API will:

- Persist the submission to the `contacts` table (existing behavior).
- Send an email notification to a configured recipient (site admin) with the submission details.

## Core Functionality

- Send an email to the admin address on successful save to database.
- Failures to send email should NOT prevent the API from returning success to the user; instead they should be logged and retried or monitored by operational tooling.

## Technical Implementation

- Backend: `apps/api/src/routes/contact.ts` will call a new internal helper that sends email using `nodemailer`.
- Email transport will be configured from environment variables using SMTP credentials or a service provider's SMTP endpoint.

### Environment Variables

- `EMAIL_FROM`: The "from" address for outgoing messages (e.g., `no-reply@yourdomain.com`).
- `EMAIL_TO`: Comma-separated list of recipient addresses for admin notifications (e.g., `team@yourdomain.com`).
- `EMAIL_SMTP_HOST`: SMTP server host.
- `EMAIL_SMTP_PORT`: SMTP server port (e.g., `587` for TLS).
- `EMAIL_SMTP_USER`: SMTP username.
- `EMAIL_SMTP_PASS`: SMTP password.
- `EMAIL_SMTP_SECURE`: Optional boolean (`true`/`false`) to use secure connection (defaults to `false` for port 587).

If `EMAIL_SMTP_*` variables are not set, the implementation will skip sending the email and only log a warning.

## API Changes

No API schema changes. The contact endpoint will still return `201` on successful submission and will not block on email sending.

## Testing Strategy

- Unit test the email helper by mocking `nodemailer.createTransport().sendMail` to assert it's called with the expected content.
- Integration test the contact route by stubbing the email helper and verifying the database insert and response.

## Future Considerations

- Add exponential backoff retry for failed emails using a job queue (e.g., BullMQ) and add status tracking to the `contacts` table (e.g., `emailSent` flag).
- Support templates and localization for email body.

## How to run locally

1. Add env vars to `.env` in `apps/api` or your environment.
2. Install new dependency in the API package: `pnpm add resend -w`.
3. Start the API with `pnpm --filter @inovacode/api dev`.

Running the smoke test

The repository includes a small smoke test at `apps/api/src/routes/contact.test.ts` that exercises the email helper. The project doesn't include a test runner by default; run it with `ts-node`:

```bash
# from repository root
pnpm --filter @inovacode/api add -D ts-node typescript @types/node
pnpm --filter @inovacode/api dlx ts-node --files src/routes/contact.test.ts
```

This will run the lightweight smoke tests which are best-effort and intended for local verification only.

## Files touched

- `apps/api/src/routes/contact.ts` (implementation)
- `apps/api/package.json` (dependency)
- `docs/features/epic-3-contact-form-email.md` (this document)

- `apps/api/templates/contact_notification.hbs` (Handlebars HTML template used for admin notification)
- `apps/api/src/lib/emailTemplates.ts` (template loader / renderer)

## Template details

The project now includes a Handlebars HTML template at `apps/api/templates/contact_notification.hbs`. You can customize branding (logo URL, colors, layout). The renderer reads `process.env.SITE_LOGO_URL` and `process.env.SITE_URL` as defaults; override when rendering if needed.
