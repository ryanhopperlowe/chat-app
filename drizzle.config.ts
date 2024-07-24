import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false,
  },
})
