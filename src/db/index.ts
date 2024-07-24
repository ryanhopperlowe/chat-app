import * as schema from "./schema"
import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"

const client = new Client({
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
})

client.connect()
export const db = drizzle(client, { schema })
