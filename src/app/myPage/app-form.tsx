"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function AppForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [thumbnail, setThumbnail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/app", {
      method: "POST",
      body: JSON.stringify({ userId, title, description, url, thumbnail }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    location.reload() // or use router.refresh() with useRouter
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="タイトル" value={title} onChange={e => setTitle(e.target.value)} required />
      <Textarea placeholder="説明" value={description} onChange={e => setDescription(e.target.value)} required />
      <Input placeholder="アプリURL" value={url} onChange={e => setUrl(e.target.value)} required />
      <Input placeholder="サムネイル画像URL" value={thumbnail} onChange={e => setThumbnail(e.target.value)} required />
      <Button type="submit">アプリを登録する</Button>
    </form>
  )
}
