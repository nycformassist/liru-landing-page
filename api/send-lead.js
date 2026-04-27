import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Allow CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Safely parse body (Vercel sometimes passes it as a string)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { name, email, website, phone } = body || {};

  // Validation
  if (!name || !email || !website) {
    return res.status(400).json({ error: 'Name, Email, and Website are required.' });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const data = await resend.emails.send({
      from: 'LIRU Intake <intake@smrgconsulting.com>',
      to: 'support@smrgconsulting.com',
      reply_to: email,
      subject: `New LIRU Pilot Request: ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #0A192F; border: 1px solid #eee; padding: 20px; border-radius: 8px; max-width: 600px;">
          <h2 style="color: #C5A059; margin-top: 0;">Qualified Pilot Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Website:</strong> <a href="${website}">${website}</a></p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #64748b;">Captured via liru.smrgconsulting.com</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, id: data.id });

  } catch (error) {
    console.error("Resend Error:", error);
    // Return the actual Resend error message to help with debugging
    return res.status(500).json({
      error: 'Failed to send email.',
      detail: error?.message || 'Unknown error'
    });
  }
}
