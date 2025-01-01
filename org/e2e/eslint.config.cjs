const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const nxEslintPlugin = require("@nx/eslint-plugin");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
    { plugins: { "@nx": nxEslintPlugin } },
    ...compat.config({
        extends: [
            "plugin:@nx/typescript"
        ]
    }).map(config => ({
        ...config,
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts"
        ],
        rules: {
            ...config.rules
        }
    })),
    ...compat.config({
        extends: [
            "plugin:@nx/javascript"
        ]
    }).map(config => ({
        ...config,
        files: [
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        rules: {
            ...config.rules
        }
    })),
];
