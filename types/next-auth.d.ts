import { type DefaultSession } from "next-auth"
import { type User as InternalUser } from "@/db/schema"

declare module "next-auth" {
  interface Session {
    user: InternalUser
  }
}
