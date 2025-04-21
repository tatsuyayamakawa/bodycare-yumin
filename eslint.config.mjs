import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginImport from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 既存のNext.js設定（互換モード）
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // import plugin のルールを追加
  {
    plugins: {
      import: eslintPluginImport,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-extraneous-dependencies": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": "error",
      "import/order": [
        "error",
        {
          pathGroupsExcludedImportTypes: [],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: false },
        },
      ],
    },
  },
];

export default eslintConfig;
