// /api/send-email.js  (Vercel Serverless function)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { to, subject, body, html, from_name } = req.body;
  const { error } = await resend.emails.send({
    from: `${from_name ?? 'Cap-X'} <team@capxrutgers.com>`,
    to,
    subject,
    ...(html ? { html } : { text: body }),
  });
  if (error) return res.status(500).json({ error });
  res.status(200).json({ ok: true });
}
