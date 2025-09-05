import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    ignorePatterns: [
      ".next/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      "out/**",
    ],
    rules: {
      "no-console": ["warn", { allow: ["error", "info", "warn"] }],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message: "Import [module] from lodash/[module] instead.",
            },
            {
              name: "next/router",
              message: "Use next/navigation instead.",
            },
            {
              name: "zod",
              importNames: ["default"],
              message:
                "Importing the default export from 'zod' is not allowed. Use named imports instead (e.g., `import { z } from 'zod'`).",
            },
          ],
        },
      ],
    },
  }),
];

export default eslintConfig;
