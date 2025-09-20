module.exports = [
    {
        files: ["**/*.js", "**/*.ts"],
        languageOptions: {
            parser: require("@typescript-eslint/parser"),
            globals: {
                React: "readonly",
                JSX: "readonly",
                node: true,
                browser: true,
            },
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    {
        ignores: ["**/*.config.js", ".*.js", "node_modules/", "dist/"],
    },
];
