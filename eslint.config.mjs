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
      // Warn about unused variables instead of disabling completely
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Allow explicit any for now (can be tightened later)
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Warn about missing dependencies in useEffect hooks
      "react-hooks/exhaustive-deps": "warn",
      
      // Warn about unescaped entities instead of disabling completely
      "react/no-unescaped-entities": "warn",
    },
  },
];

export default eslintConfig;
