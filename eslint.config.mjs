import js from "@eslint/js";
import globals from "globals"; // Нужно установить этот пакет

export default [
  js.configs.recommended,
  
  // Конфигурация для браузерных файлов
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        crypto: "readonly",
      }
    }
  },
  
  // Конфигурация для Node.js файлов (webpack.config.js и т.д.)
  {
    files: ["*.config.js", "webpack.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // Важно для Node.js
      globals: {
        ...globals.node, // Добавляет require, module, __dirname и др.
      }
    }
  },
  
  // Игнорирование файлов (вместо .eslintignore)
  {
    ignores: ["dist/**", "build/**", "node_modules/**"]
  }
];