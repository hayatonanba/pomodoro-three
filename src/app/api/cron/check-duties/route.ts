import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const now = new Date()

  // 期限切れで未完了の義務を取得
  const expiredDuties = await prisma.reviewDuty.findMany({
    where: {
      dueDate: { lt: now },
      isCompleted: false
    }
  })

  // 処理対象がなければ即終了
  if (expiredDuties.length === 0) {
    return NextResponse.json({ message: "No expired duties found." })
  }

  for (const duty of expiredDuties) {
    await prisma.$transaction([
      // バッドマーク加算
      prisma.user.update({
        where: { id: duty.fromUserId },
        data: { badMarks: { increment: 1 } }
      }),
      // 義務を完了扱いに変更（期限切れで）
      prisma.reviewDuty.update({
        where: { id: duty.id },
        data: { isCompleted: true }
      })
    ])
  }

  return NextResponse.json({
    message: "Expired duties processed",
    count: expiredDuties.length
  })
}
