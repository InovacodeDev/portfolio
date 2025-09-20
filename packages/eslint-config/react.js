module.exports = [
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: require("@typescript-eslint/parser"),
            globals: {
                React: "readonly",
                JSX: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
            react: require("eslint-plugin-react"),
            "react-hooks": require("eslint-plugin-react-hooks"),
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        ignores: ["**/*.config.js", ".*.js", "node_modules/", "dist/"],
    },
];
