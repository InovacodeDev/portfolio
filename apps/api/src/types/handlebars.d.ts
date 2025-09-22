declare module "handlebars" {
    export function compile(template: string): (context?: unknown) => string;
    const Handlebars: { compile: typeof compile };
    export default Handlebars;
}
