const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["eslint.config.js", "vite.config.js", "scripts/**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ...js.configs.recommended,
  },
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-alert": "off",
    },
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-alert": "off",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
  },
];
