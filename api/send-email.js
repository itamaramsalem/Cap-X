// /api/send-email.js  (Vercel Edge/Serverless function)
// npm install resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { to, subject, body, from_name } = req.body;
  const { error } = await resend.emails.send({
    from: `${from_name ?? 'Cap-X'} <noreply@yourdomain.com>`,
    to,
    subject,
    text: body,
  });
  if (error) return res.status(500).json({ error });
  res.status(200).json({ ok: true });
}
