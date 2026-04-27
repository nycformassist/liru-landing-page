import { Resend } from 'resend';

// Vercel handles the API Key from your Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract all fields from the new qualification form
  const { name, email, website, phone } = req.body;

  if (!email || !name || !website) {
    return res.status(400).json({ error: 'Missing required qualification fields.' });
  }

  try {
    const data = await resend.emails.send({
      // Keep 'onboarding@resend.dev' until you verify smrgconsulting.com in Resend
      from: 'LIRU Intake <onboarding@resend.dev>', 
      to: 'support@smrgconsulting.com', // CORRECTED RECIPIENT EMAIL
      reply_to: email, 
      subject: `🔥 New LIRU Pilot Request: ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #0A192F; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #C5A059; margin-bottom: 20px;">Qualified Pilot Request</h2>
          <p><strong>Contact Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Firm Website:</strong> <a href="${website}" target="_blank">${website}</a></p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">This lead was captured via liru.smrgconsulting.com</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, id: data.id });
    
  } catch (error) {
    console.error("Resend API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
