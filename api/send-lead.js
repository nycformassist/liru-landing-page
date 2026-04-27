import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, website, phone } = req.body;

  // Validate that all required fields are present
  if (!name || !email || !website) {
    return res.status(400).json({ error: 'All qualification fields are required.' });
  }

  try {
    const data = await resend.emails.send({
      from: 'LIRU Intake <onboarding@resend.dev>', 
      to: 'support@smrgconsulting.com', // Corrected Recipient
      reply_to: email, 
      subject: `🔥 New LIRU Pilot Request: ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #0A192F;">
          <h2>Qualified Pilot Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Website:</strong> <a href="${website}">${website}</a></p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>
      `
    });
    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
