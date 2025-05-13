import { auth } from "../../../auth" // auth() は server side 用
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { AppForm } from "./app-form"

export default async function myPage() {
  const session = await auth()

  if (!session?.user) return <p>ログインしてください</p>

  const apps = await prisma.app.findMany({
    where: { user: { email: session.user.email! } },
    orderBy: { createdAt: "desc" },
  })

  const duties = await prisma.reviewDuty.findMany({
    where: { fromUserId: session.user.id, isCompleted: false },
    include: { toUser: true }
  })
  

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">マイページ</h1>
      <h2 className="text-xl font-semibold">あなたのレビュー義務</h2>
      {duties.length === 0 && <p>未完の義務はありません。</p>}
      {duties.map(duty => (
        <div key={duty.id} className="border p-4 rounded space-y-1">
          <p className="text-sm">
            次のユーザーのアプリを1件レビューしてください：
            <span className="font-bold">{duty.toUser.name ?? "匿名ユーザー"}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            期限: {duty.dueDate.toLocaleDateString()}
          </p>
        </div>
))}


      <AppForm userId={session.user.id} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">投稿済みアプリ</h2>
        {apps.map(app => (
          <div key={app.id} className="border p-4 rounded">
            <h3 className="font-bold">{app.title}</h3>
            <p>{app.description}</p>
            <a href={app.url} target="_blank" className="text-blue-600 underline">アプリを見る</a>
          </div>
        ))}
      </div>
    </main>
  )
}
