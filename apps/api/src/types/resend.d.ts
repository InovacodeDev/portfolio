declare module "resend" {
    export class Resend {
        constructor(apiKey: string);
        emails: {
            send(opts: {
                from: string;
                to: string | string[];
                subject?: string;
                text?: string;
                html?: string;
            }): Promise<unknown>;
        };
    }

    export default Resend;
}
