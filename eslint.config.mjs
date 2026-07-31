import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-build/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The Studio is a separate app with its own toolchain; these Next.js rules
    // don't apply to it, and `sanity build` leaves a bundle in studio/dist that
    // eslint would otherwise lint.
    "studio/**",
  ]),
]);

export default eslintConfig;
