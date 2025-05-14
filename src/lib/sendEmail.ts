import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendReviewDutyEmail(toEmail: string, fromUserName: string) {
  return resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: [toEmail],
    subject: `${fromUserName} さんがあなたのアプリをレビューしました`,
    html: `
      <p>あなたのアプリがレビューされました 🎉</p>
      <p>1週間以内にレビューを返してください。</p>
      <p>返信しないとバッドマークがつきます。</p>
    `,
  })
}
