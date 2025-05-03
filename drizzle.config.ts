import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DB_URL } from "./src/config";

export default defineConfig({
  out: "./.migrations",
  dialect: "postgresql",
  schema: "./src/db/tables.ts",
  dbCredentials: {
    url: DB_URL,
  },
});
