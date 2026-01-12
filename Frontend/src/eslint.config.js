import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import pluginReact from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      js,
    },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-magic-numbers": "error",
      "unused-imports/no-unused-imports": "error",
      curly: "error",
      semi: "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "key-spacing": "error",
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "no-trailing-spaces": "error",
      eqeqeq: "error",
      "comma-dangle": ["error", {
        "arrays": "never",
        "objects": "only-multiline",
        "imports": "never",
        "exports": "never",
        "functions": "never",
      }],
    },
  }
]);
