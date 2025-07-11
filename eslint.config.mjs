import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused variable warnings for development
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Allow explicit any for now (can be tightened later)
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Disable exhaustive deps warning for now
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
