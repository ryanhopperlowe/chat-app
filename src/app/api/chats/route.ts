import { NewChat } from "@/db/schema"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const body = (await req.json()) as NewChat
}
