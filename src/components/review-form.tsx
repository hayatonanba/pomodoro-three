"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export function ReviewForm({ appId, toUserId }: { appId: string, toUserId: string }) {
  const [rating, setRating] = useState("5")
  const [comment, setComment] = useState("")

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/review", {
      method: "POST",
      body: JSON.stringify({ rating: Number(rating), comment, appId, toUserId }),
      headers: { "Content-Type": "application/json" }
    })
    location.reload()
  }

  return (
    <form onSubmit={submitReview} className="space-y-4">
      <Select value={rating} onValueChange={setRating}>
        <SelectTrigger>
          <SelectValue placeholder="評価 (1~5)" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5].map(n => (
            <SelectItem key={n} value={String(n)}>{n} ★</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        placeholder="感想やフィードバック（最大500文字）"
        value={comment}
        onChange={e => setComment(e.target.value)}
        maxLength={500}
        required
      />

      <Button type="submit">レビュー投稿</Button>
    </form>
  )
}
