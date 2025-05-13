import { prisma } from "@/lib/prisma"
import { auth } from "../../../../auth"
import { ReviewForm } from "@/components/review-form"

export default async function AppDetail({ params }: { params: { id: string } }) {
  const session = await auth()
  const appId = params.id

  const app = await prisma.app.findUnique({
    where: { id: appId },
    include: { user: true }
  })

  const reviews = await prisma.review.findMany({
    where: { appId: params.id },
    include: { fromUser: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <img src={app?.thumbnail} className="rounded" alt={app?.title} />
      <h1 className="text-2xl font-bold">{app?.title}</h1>
      <p>{app?.description}</p>
      <p className="text-sm text-muted-foreground">by {app?.user.name}</p>

      <a href={app?.url} className="text-blue-600 underline" target="_blank">アプリを開く</a>

      {session?.user && (
        <div>
          <h2 className="text-lg font-semibold">レビューする</h2>
          <ReviewForm appId={app.id} toUserId={app.userId} />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">レビュー一覧</h2>
        {reviews.length === 0 && <p>まだレビューがありません。</p>}
        {reviews.map(r => (
          <div key={r.id} className="border p-4 rounded">
            <p className="font-bold">{r.fromUser.name ?? "匿名"}</p>
            <p>⭐ {r.rating} / 5</p>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
