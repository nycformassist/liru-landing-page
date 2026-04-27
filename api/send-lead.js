import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, website, phone } = req.body;

  // Validation
  if (!name || !email || !website) {
    return res.status(400).json({ error: 'Name, Email, and Website are required.' });
  }

  try {
    const data = await resend.emails.send({
      // Use intake@smrgconsulting.com now that your domain is verified Green
      from: 'LIRU Intake <intake@smrgconsulting.com>', 
      to: 'support@smrgconsulting.com',
      reply_to: email, 
      subject: `🔥 New LIRU Pilot Request: ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #0A192F; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #C5A059;">Qualified Pilot Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Website:</strong> <a href="${website}">${website}</a></p>
          <p><strong>Phone:</strong> ${phone}</p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #64748b;">Captured via liru.smrgconsulting.com</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, id: data.id });
    
  } catch (error) {
    console.error("Resend Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
