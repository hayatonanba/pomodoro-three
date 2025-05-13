import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, title, description, url, thumbnail } = body

  if (!userId || !title || !url || !thumbnail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const app = await prisma.app.create({
    data: {
      userId,
      title,
      description,
      url,
      thumbnail
    }
  })

  return NextResponse.json(app)
}
