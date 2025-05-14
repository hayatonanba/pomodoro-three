import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../../auth"
import { sendReviewDutyEmail } from "@/lib/sendEmail"
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

  await prisma.reviewDuty.updateMany({
    where: {
      fromUserId: session.user.id,  // 今レビューした人
      toUserId,                     // 義務の相手
      isCompleted: false
    },
    data: {
      isCompleted: true
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

    const toUser = await prisma.user.findUnique({
      where: { id: toUserId }
    })
  
    if (toUser?.email) {
      await sendReviewDutyEmail(toUser.email, session.user.name ?? "あるユーザー")
    }
  }

  return NextResponse.json(review)
}


