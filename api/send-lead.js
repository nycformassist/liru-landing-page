import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'LIRU Intake <onboarding@resend.dev>', 
      to: 'info@smrgconsulting.com',
      subject: '🔥 New LIRU Lead: Pilot Requested',
      html: `<p>New lead requested access: <strong>${email}</strong></p>`
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
}
