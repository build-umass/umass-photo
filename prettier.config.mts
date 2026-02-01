import { type Config } from "prettier";
import { type SqlFormatOptions } from "prettier-plugin-sql";

const config: Config = {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-sql"],
  overrides: [
    // Configuration for prettier-plugin-sql
    {
      files: "*.sql",
      options: {
        formatter: "sql-formatter",
        language: "postgresql",
        keywordCase: "upper",
        dataTypeCase: "upper",
        functionCase: "upper",
        identifierCase: "lower",
        indentStyle: "standard",
        logicalOperatorNewline: "before",
        expressionWidth: 50,
        linesBetweenQueries: 2,
        denseOperators: false,
        newlineBeforeSemicolon: false,
      } satisfies SqlFormatOptions,
    },
  ],
};

export default config;
