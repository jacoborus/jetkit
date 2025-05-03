import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    files: ["src/**/*.ts"],
    ignores: ["dist/*"],
    languageOptions: {
      parserOptions: {
        allowDefaultProject: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
