import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../../auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { appId, toUserId, rating, comment } = await req.json()

  const review = await prisma.review.create({
    data: {
      appId,
      rating,
      comment,
      fromUserId: session.user.id,
      toUserId,
    }
  })

  const existingDuty = await prisma.reviewDuty.findFirst({
    where: {
      fromUserId: toUserId, // レビューされた側
      toUserId: session.user.id, // レビューしてきた人
      isCompleted: false,
    }
  })
  
  if (!existingDuty) {
    await prisma.reviewDuty.create({
      data: {
        fromUserId: toUserId,
        toUserId: session.user.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1週間後
        relatedAppId: appId,
      }
    })
  }

  return NextResponse.json(review)
}


