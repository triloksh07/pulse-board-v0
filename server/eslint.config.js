import importX from "eslint-plugin-import-x";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      "import-x": importX,
    },
    rules: {
      "import-x/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          js: "always",
        },
      ],
    },
  },
];
