import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Capturing the 4 fields sent from your index.html
  const { name, email, website, phone } = req.body;

  try {
    const data = await resend.emails.send({
      // PRO TIP: Since you are verified "Green", you can now use your own domain
      from: 'LIRU Intake <intake@smrgconsulting.com>', 
      to: 'info@smrgconsulting.com',
      reply_to: email, 
      subject: `🔥 New LIRU Pilot Request: ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #0A192F;">
          <h2 style="color: #C5A059;">Qualified Pilot Request</h2>
          <p><strong>Contact Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Firm Website:</strong> <a href="${website}">${website}</a></p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Captured via liru.smrgconsulting.com</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, id: data.id });
    
  } catch (error) {
    console.error("Resend API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
