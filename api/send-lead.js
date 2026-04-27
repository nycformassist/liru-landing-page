import { Resend } from 'resend';

// Vercel handles the API Key from your Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Extract and validate email
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  try {
    // 3. Send the notification to YOU
    const data = await resend.emails.send({
      /* IMPORTANT: Keep 'onboarding@resend.dev' UNTIL you verify 
         smrgconsulting.com in your Resend Dashboard settings.
      */
      from: 'LIRU Intake <onboarding@resend.dev>', 
      to: 'info@smrgconsulting.com',
      reply_to: email, // This allows you to reply directly to the lead
      subject: '🔥 New LIRU Lead: Pilot Requested',
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #0A192F;">
          <h2 style="color: #C5A059;">New LIRU Lead Captured</h2>
          <p>A new firm has requested access to the <strong>LIRU Pilot Program</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Lead Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><em>This lead was captured via liru.smrgconsulting.com</em></p>
        </div>
      `
    });

    // 4. Return success to the landing page
    return res.status(200).json({ success: true, id: data.id });
    
  } catch (error) {
    console.error("Resend API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
