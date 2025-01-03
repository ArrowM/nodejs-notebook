import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
), {
    plugins: {
        "simple-import-sort": simpleImportSort,
        "unused-imports": unusedImports,
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.json",
        },
    },

    rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-floating-promises": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^ignored",
        }],

        "comma-dangle": ["error", "always-multiline"],
        "no-unused-expressions": "error",
        "no-undef": "off",
        "no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "simple-import-sort/imports": "error",

        "brace-style": ["error", "stroustrup", {
            allowSingleLine: true,
        }],

        "comma-spacing": ["error", {
            before: false,
            after: true,
        }],

        "comma-style": ["error", "last"],
        "curly": ["error", "multi-line", "consistent"],
        "dot-location": ["error", "property"],

        "indent": ["error", "tab", {
            SwitchCase: 1,
        }],

        "max-nested-callbacks": ["error", {
            max: 4,
        }],

        "max-statements-per-line": ["error", {
            max: 2,
        }],

        "no-case-declarations": "off",

        "no-empty-function": ["error", {
            allow: ["constructors"],
        }],

        "no-floating-decimal": "error",
        "no-inner-declarations": "off",
        "no-lonely-if": "error",
        "no-multi-spaces": "error",

        "no-multiple-empty-lines": ["error", {
            max: 2,
            maxEOF: 0,
            maxBOF: 0,
        }],

        "no-trailing-spaces": "error",
        "no-var": "error",
        "object-curly-spacing": ["error", "always"],
        "prefer-const": "error",

        "quotes": ["error", "double", {
            avoidEscape: true,
            allowTemplateLiterals: true,
        }],

        "semi": ["error", "always"],
        "space-before-blocks": "error",

        "space-before-function-paren": ["error", {
            anonymous: "never",
            named: "never",
            asyncArrow: "always",
        }],

        "space-infix-ops": "error",
        "space-unary-ops": "error",

        "spaced-comment": ["error", "always", {
            line: {
                markers: ["/"],
                exceptions: ["-", "+"],
            },

            block: {
                balanced: false,
            },
        }],

        "arrow-body-style": ["error", "as-needed"],
        "no-extra-parens": ["error", "all", {
            "conditionalAssign": false,
            "nestedBinaryExpressions": false,
        }],

        "yoda": ["error", "never"],
    },
}];