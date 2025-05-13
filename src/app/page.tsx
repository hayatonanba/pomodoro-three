import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default async function Home() {
  const apps = await prisma.app.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  })

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {apps.map(app => (
        <Link key={app.id} href={`/apps/${app.id}`}>
          <Card className="hover:shadow-md transition">
            <img
              src={app.thumbnail}
              alt={app.title}
              className="w-full h-40 object-cover rounded-t"
            />
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-bold truncate">{app.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2">{app.description}</p>
              <p className="text-xs text-right text-gray-400">by {app.user.name ?? "匿名ユーザー"}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </main>
  )
}
